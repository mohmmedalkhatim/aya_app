import client from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { app_router, auth_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import dayjs from "dayjs";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export let storage: Store;
listen("url", (event) => {
    console.log("Received redirect URI:", event.payload);
})
invoke("start_oauth_server").then(res => console.log(res))

let root = client.createRoot(document.getElementById("root") as HTMLDivElement);
load("storage").then((res) => {
    storage = res;
    storage.get("access_token").then((res) => {
        root.render(
            <RouterProvider router={res ? app_router : auth_router} />
        )
    })

})



