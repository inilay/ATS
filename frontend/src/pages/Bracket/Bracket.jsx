import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../components/UI/Loader/Loader";
import RoundRobin from "../../components/RoundRobin";
import SingleEl from "../../components/SingleEl";
import DoubleEl from "../../components/DoubleEl";
import Swiss from "../../components/Swiss";
import bracketApi from "../../services/api/bracketApi";
import axios from "axios";
import BracketController from "../../components/BracketController/BracketController.jsx";
import { setBracket, setAnonymous, clearBracket } from "../../store/bracket";
import { useDispatch } from "react-redux";
import classes from "./Bracket.module.css";
import MyButton from "../../components/UI/MyButton/MyButton.jsx";

const Bracket = () => {
    const params = useParams();
    const api = axios;
    const dispatch = useDispatch();

    const [fetchBrackets, isBraLoadind, braError] = useFetching(async (link) => {
        const response = await bracketApi.getBracket(api, link).then((response) => {
            dispatch(setBracket({ brackets: [response.data] }));
            dispatch(setAnonymous({ anonymous: true }));
        });
    });

    useEffect(() => {
        fetchBrackets(params.link);
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearBracket());
        };
    }, []);

    const copyToClipboard = () => {
        const currentUrl = window.location.href;

        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(currentUrl)
                .then(() => {})
                .catch((err) => {});
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement("textarea");
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {}
            document.body.removeChild(textArea);
        }
    };

    return (
        <section className={`${classes.bracket_container}`}>
            {isBraLoadind ? (
                <div className="loader">
                    <Loader />
                </div>
            ) : (
                <div className="container">
                    <BracketController />
                </div>
            )}
            <div className={`${classes.bracket_control_container}`}>
                <MyButton
                    onClick={() => {
                        copyToClipboard();
                    }}
                    additionalCl={`${classes.copy_button}`}
                >
                    Copy link
                </MyButton>
                <div className={`${classes.bracket_warning}`}>
                    This bracket will be deleted over time to save the bracket create a tournament.
                </div>
            </div>
        </section>
    );
};

export default Bracket;
