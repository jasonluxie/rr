import { useRef, useEffect } from "react";
const Search = () => {
    const autoCompleteRef = useRef();
    const inputRef = useRef();
    const options = {
        fields: ["address_components", "name", "geometry"],
        types: ["restaurant"],
        componentRestrictions: { country: ["US", "PH", "JP", "MX"] },
    };
    useEffect(() => {
        autoCompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            options
        );
    }, []);
    return (
        <div>
<script
    async
    src={`https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_MAPS_API
    }&libraries=places&callback=initMap`}
></script>
            <h1>Restaurant Royale</h1>
            <input
                ref={inputRef}
                id="searchTextField"
                type="text"
                size="50"
                placeholder="Enter your address"
            />
        </div>
    );
};

export default Search;
