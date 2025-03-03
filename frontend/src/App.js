import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNavbar from "./components/UI/MyNavbar/MyNavbar";
import MyFooter from "./components/UI/MyFooter/MyFooter";
import AppRouter from "./components/AppRouter";
import "./styles/App.css";
import { AuthProvider } from "./context";
import { onMessageListener } from "./firebase";


function App() {
    onMessageListener().then((payload) => {
        console.log('recive notification');
        var options = {
            body: payload.notification.body,
            icon: '/logo512.png'
          };
        new Notification(payload.notification.title, options);
    })
    .catch((err) => console.log("failed: ", err));


    return (
        <BrowserRouter>
            <AuthProvider>
                <MyNavbar />
                <AppRouter />
                <MyFooter />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
