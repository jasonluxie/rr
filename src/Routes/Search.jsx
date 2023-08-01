const Search = () => {
    function success(pos) {
        const crd = pos.coords;
        workerPing(pos.coords.latitude, pos.coords.longitude)
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    function getLocation() {
        navigator.geolocation.getCurrentPosition(success, null, options);
    }

    async function workerPing(latitude, longitude) {
        const response = await fetch("https://rr.jasonluxie.workers.dev/?lat=" + latitude +"&lng=" + longitude);
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
                onClick={getLocation}
            />
        </div>
    );
};

export default Search;

