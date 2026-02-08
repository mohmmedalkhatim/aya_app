import client from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { load } from '@tauri-apps/plugin-store';

export let storage = await load("local_values");

let root = client.createRoot(document.getElementById("root") as HTMLDivElement);


root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)