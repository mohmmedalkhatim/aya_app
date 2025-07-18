import client from "react-dom/client";
import App from "./app";
import React from "react";


let react = client.createRoot(document.getElementById("root") as HTMLDivElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)