export async function onRequest(context) {
    const { request, env } = context;

    // Define standard response headers including CORS fallback
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
    };

    // Handle OPTIONS preflight requests
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: corsHeaders,
        });
    }

    // Only allow GET requests
    if (request.method !== "GET") {
        return new Response(
            JSON.stringify({ error: "Method Not Allowed. Only GET is supported." }),
            {
                status: 405,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // Parse query parameters
    const clientRequest = new URL(request.url);
    const latStr = clientRequest.searchParams.get("lat");
    const lngStr = clientRequest.searchParams.get("lng");
    const radius = clientRequest.searchParams.get("radius") || "8000"; // default to 8000 meters (~5 miles)

    // Validate coordinates
    if (!latStr || !lngStr) {
        return new Response(
            JSON.stringify({ error: "Missing required query parameters: 'lat' and 'lng'." }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    // --- CLOUDFLARE CACHING SHIELD ---
    // Round lat/lng to 3 decimal places (~100m grid) to group nearby queries.
    // This prevents duplicate charges if you spin multiple times or reload in the same location.
    const roundedLat = lat.toFixed(3);
    const roundedLng = lng.toFixed(3);

    const cacheUrl = new URL(request.url);
    cacheUrl.searchParams.set("lat", roundedLat);
    cacheUrl.searchParams.set("lng", roundedLng);
    cacheUrl.searchParams.set("radius", radius);
    
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    try {
        // Check if we have a cached response for this general location
        let cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            const headers = new Headers(cachedResponse.headers);
            headers.set("X-Cache-Status", "HIT");
            return new Response(cachedResponse.body, {
                status: 200,
                headers: headers
            });
        }
    } catch (cacheError) {
        console.error("Cache match failed: ", cacheError.message);
    }

    // Retrieve Google Places API key from environment variables
    const googleApiKey = env.MAPS_KEY;
    if (!googleApiKey) {
        return new Response(
            JSON.stringify({
                error: "MAPS_KEY environment variable is not configured on this Pages Project.",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // Construct Google Places Nearby Search URL
    const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=restaurant&key=${googleApiKey}`;

    try {
        const googleResponse = await fetch(googlePlacesUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!googleResponse.ok) {
            const errorData = await googleResponse.json().catch(() => ({}));
            return new Response(
                JSON.stringify({
                    error: "Google Places API request failed.",
                    details: errorData,
                    status: googleResponse.status,
                }),
                {
                    status: googleResponse.status,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const data = await googleResponse.json();

        // Create response headers for caching
        const responseHeaders = {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600", // Cache successful responses for 1 hour at the edge
            "X-Cache-Status": "MISS",
        };

        const freshResponse = new Response(JSON.stringify(data), {
            status: 200,
            headers: responseHeaders,
        });

        // Store in Cloudflare Cache if the request was successful
        if (data.status === "OK" || data.status === "ZERO_RESULTS") {
            context.waitUntil(cache.put(cacheKey, freshResponse.clone()));
        }

        return freshResponse;
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "An error occurred while connecting to the Google Places API.",
                message: error.message,
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
