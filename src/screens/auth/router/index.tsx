import { createBrowserRouter,createRoutesFromElements, Route, Routes } from "react-router-dom";
import SignIn from "../screens/sign_in";
import SignUp from "../screens/sign_up";


let auth_router = createBrowserRouter(
    createRoutesFromElements(
        <Routes>
            <Route path="/sign_in" index element={<SignIn/>}/>
            <Route path="/sign_up" element={<SignUp/>}/>
        </Routes>
    )
)