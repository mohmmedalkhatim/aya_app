import client from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { app_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import { Keys, useStore } from "./context";


let root = client.createRoot(document.getElementById("root") as HTMLDivElement);

export let storage: Store;

function App() {

    return (
        <RouterProvider router={app_router} />
    )
}



load("storage").then((res) => {
    storage = res;
    storage.get<Keys>("keys").then((keys) => {
        if (keys) useStore.setState({ keys })
        root.render(
            <App />
        )
    })

})



