import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../app";
import SignIn from "../screens/auth/screens/sign_in";
import Profile from "../screens/profile";
import Calculator from "../screens/calculator";
import Calendar from "../screens/calendar";
import SignUp from "../screens/auth/screens/sign_up";
import Medicine from "../screens/medicine";
import { MedicineScan } from "../screens/medicine_scan"; // Ensure this is exported as a named export
import Dashboard from "../screens/Dashboard/Home";

export let app_router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route element={<Dashboard />} index path="/"></Route>
            <Route element={<Profile />} path="/profile"></Route>
            <Route element={<Medicine />} path="/medicine/search/:name"></Route>            
            <Route element={<MedicineScan />} path="/scan"></Route>
            <Route path="/sign_in" element={<SignIn />} />
            <Route path="/sign_up" element={<SignUp />} />
        </Route>
    )
)