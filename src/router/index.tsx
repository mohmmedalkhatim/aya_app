import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../app";
import Dashboard from "../screens/Dashboard";



let router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route element={<Dashboard />} index path="/"></Route>
        </Route>
    )
)
export default router;