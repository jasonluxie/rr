import { useState } from "react";
import "./App.css";
import { Loader } from "@googlemaps/js-api-loader";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./Routes/Search";
// import Result from "./Routes/Result";

function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Search />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
