import client from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";


client.createRoot(document.getElementById("root") as HTMLDivElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)