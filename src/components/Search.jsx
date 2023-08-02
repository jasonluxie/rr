import { useState } from "react";
import Results from "./Results.jsx";

const Search = () => {
    const [restaurant, setRestaurant] = useState({});
    const [tracker, setTracker] = useState(0);
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    function getLocation() {
        navigator.geolocation.getCurrentPosition(success, null, options);
    }
    function success(pos) {
        const crd = pos.coords;
        workerPing(pos.coords.latitude, pos.coords.longitude);
    }
    async function workerPing(latitude, longitude) {
        const response = await fetch(
            "https://rr.jasonluxie.workers.dev/?lat=" +
                latitude +
                "&lng=" +
                longitude
        );

        const data = await response.json();
        setRestaurant(data);
        setTracker(1);
    }

    if (tracker == 0) {
        return (
            <div>
                <h1>Restaurant Royale</h1>
                <input
                    id="initBtn"
                    type="button"
                    value="Boop"
                    onClick={getLocation}
                />
            </div>
        );
    } else if (tracker == 1) {
        return (
            <div>
                <h1>Restaurant Royale</h1>
                <input
                    id="initBtn"
                    type="button"
                    value="Boop"
                    onClick={getLocation}
                />
                <Results data={restaurant} />
            </div>
        );
    }
};

export default Search;
