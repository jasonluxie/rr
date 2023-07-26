import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./Routes/Search";
// import Result from "./Routes/Result";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Search/>} />
                    {/* <Route path="/result" element={Result} /> */}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
