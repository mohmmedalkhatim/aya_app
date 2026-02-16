import client from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { app_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import dayjs from "dayjs";

export let storage: Store;

load("local_values").then((res) => {
    console.log(dayjs().format())
    storage = res
    root.render(
        <React.StrictMode>
            <RouterProvider router={app_router} />
        </React.StrictMode>
    )
})

let root = client.createRoot(document.getElementById("root") as HTMLDivElement);


