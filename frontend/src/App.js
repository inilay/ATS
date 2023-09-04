import React, { useEffect, useState } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MyNavbar from "./components/UI/MyNavbar/MyNavbar";
import MyFooter from "./components/UI/MyFooter/MyFooter";
import AppRouter from "./components/AppRouter";
import './styles/App.css';
import { AuthProvider } from "./context";


function App() {

    return (  
            <BrowserRouter>
                <AuthProvider>
                    <MyNavbar/>
                    <AppRouter/>
                    <MyFooter/>
                </AuthProvider>
            </BrowserRouter>
    );
}

export default App;