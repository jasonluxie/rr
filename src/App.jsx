import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./components/Search"

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
