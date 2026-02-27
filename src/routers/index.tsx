import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../app";
import Dashboard from "../screens/Dashboard";
import SignIn from "../screens/auth/screens/sign_in";
import Profile from "../screens/profile";
import Calculator from "../screens/calculator";
import Calendar from "../screens/calendar";
import Auth from "../screens/auth/main";
import SignUp from "../screens/auth/screens/sign_up";



let app_router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route element={<Dashboard />} index path="/"></Route>
            <Route element={<Calculator />} path="/calculator"></Route>
            <Route element={<Profile />} path="/profile"></Route>
            <Route element={<Calendar />} path="/calendar"></Route>
        </Route>
    )
)
let auth_router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Auth/>}>
            <Route path="/" index element={<SignIn/>}/>
            <Route path="/sign_up" element={<SignUp/>}/>
        </Route>
    )
)
export { app_router, auth_router };