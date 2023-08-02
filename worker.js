export default {
    async fetch(request, env, ctx) {
        const clientRequest = new URL(request.url);
        let lat = clientRequest.searchParams.get("lat");
        let lng = clientRequest.searchParams.get("lng");
        const url =
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&location=" +
            lat +
            "%2C" +
            lng +
            "&radius=10000&type=restaurant&key= " +
            env.MAPS_KEY;
        const init = {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        };
        const response = {};
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("content-type", "application/json;charset=UTF-8");

        async function gatherResponse(response) {
            const { headers } = response;
            const contentType = headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return chooseRes(await response.json())
            }
            return response.text();
        }
        function chooseRes (object) {
            let chosenRes = object.results[Math.floor(Math.random()*object.results.length)]
            return JSON.stringify(chosenRes)
        }
        const mapsResponse = await fetch(url, init);
        let mapObject = await gatherResponse(mapsResponse);

        response.body = mapObject;
        return new Response(response.body, {
            headers: responseHeaders,
            status: response.status,
            statusText: response.statusText,
        });
    },
};
