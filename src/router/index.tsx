import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../app";
import Dashboard from "../screens/Dashboard";
import SignIn from "../screens/auth/screens/sign_in";



let router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route element={<Dashboard />} index path="/"></Route>
            <Route element={<SignIn/>} path="/sign_in"></Route>
        </Route>
    )
)
export default router;