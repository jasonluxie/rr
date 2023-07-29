import { useRef, useEffect } from "react";

const Search = () => {
    
    return (
        <div>
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
