import { useRef, useEffect } from "react";

const Search = () => {

    async function workerPing() {
        const response = await fetch("https://rr.jasonluxie.workers.dev/?lat=2&long=2");
        const restaurants = await response.json();
        console.log(restaurants);
      }

    return (
        <div>
            <h1>Restaurant Royale</h1>
            <input
                id="initBtn"
                type="button"
                value="Boop"
                onClick={workerPing}
            />
        </div>
    );
};

export default Search;

