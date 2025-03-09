import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_SERVER } from "../Variables";
export const AuthContext = createContext(null);

export const ThemeContext = createContext(null);


const api = axios;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null,
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")) : null,
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch(`${API_SERVER}/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/");
        } else {
            // alert("Something went wrong!");
        }
    };

    const registerUser = async (username, email, password, password2) => {
        let body = {
            username: username,
            email: email,
            password: password,
            password2: password2,
        };
        console.log("body", body);

        const response = await axios
            .post(`${API_SERVER}/register/`, body, {
                validateStatus: function (status) {
                    return status == 201;
                },
            })
            .then((response) => {
                setTimeout(() => {
                    loginUser(email, password);
                }, 3000);
                // loginUser(email, password)
            });

        return response;
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
