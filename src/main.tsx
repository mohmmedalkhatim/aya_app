import client from "react-dom/client";
import React, { useEffect } from "react";
import { Navigate, RouterProvider, useNavigate, useNavigation } from "react-router-dom";
import { app_router, auth_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import dayjs from "dayjs";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Info, useStore } from "./context";

export let storage: Store;
listen("url", (event) => {
    console.log("Received redirect URI:", event.payload);
})
invoke("start_oauth_server").then(res => console.log(res))
function App() {
    let info = useStore(state => state.info.access_token)
    return (
        <RouterProvider router={info !== "" ? app_router : auth_router} />
    )
}
export default App

let root = client.createRoot(document.getElementById("root") as HTMLDivElement);
load("storage").then((res) => {
    storage = res;
    storage.get<Info>("info").then((info) => {
        if (info) {
            useStore.setState({ info })
        }
        root.render(
            <App />
        )
    })

})



