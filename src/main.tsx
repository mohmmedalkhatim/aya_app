import client from "react-dom/client";
import React, { useEffect } from "react";
import { Navigate, RouterProvider, useNavigate, useNavigation } from "react-router-dom";
import { app_router, auth_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import dayjs from "dayjs";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Keys, useStore } from "./context";

export let storage: Store;
listen("url", (event) => {
    console.log("Received redirect URI:", event.payload);
})
invoke("start_oauth_server").then(res => console.log(res))
function App() {
    let access_token = useStore(state => state.keys.access_token)
    return (
        <RouterProvider router={access_token !== "" ? app_router : auth_router} />
    )
}
export default App

let root = client.createRoot(document.getElementById("root") as HTMLDivElement);
load("storage").then((res) => {
    storage = res;
    storage.get<Keys>("keys").then((keys) => {
        if (keys) useStore.setState({ keys })
        root.render(
            <App />
        )
    })

})



