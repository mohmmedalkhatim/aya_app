import client from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { app_router } from "./routers";
import { load, Store } from '@tauri-apps/plugin-store';
import { Keys, useStore } from "./context";
import { getPassword, getSecret, setSecret } from "tauri-plugin-keyring-api"
import { hostname } from "@tauri-apps/plugin-os";
import {  schedule } from "./schadule";

// Boot sequence - runs once, in parallel with the UI rendering
Promise.all([initDetector(), initOcr()])
  .then(() => console.log("[AYA] On-device AI ready"))
  .catch(err => console.error("[AYA] AI init failed:", err));
let root = client.createRoot(document.getElementById("root") as HTMLDivElement);

export let storage: Store;

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { initDetector } from "./lib/detector";
import { initOcr } from "./lib/ocr";


function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            syncTouch: true,
            autoResize: true
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <RouterProvider router={app_router} />;
}

(async () => {
    let res = await load("storage");
    storage = res;

    let name = await hostname() as string;

    await getPassword("aya.app", name).then((key) => {
        if (key) {
            useStore.setState({ keys: { access_token: key } });
        }
    });
    await schedule()
    root.render(<App />);
})();



