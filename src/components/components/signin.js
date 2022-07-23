import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import decode from "jwt-decode";
import axios from "axios";
import { ethers } from "ethers";
import Action from "../../service";

const SignIn = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = props;
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [state, { dispatch, translateLang }] = useBlockchainContext();

    const userName = (val) => {
        setName(val);
    };
    const passWord = (val) => {
        setPassword(val);
    };
    const toSignUp = () => {
        auth(false);
    };
    const signIn = async () => {
        var user = {
            name: name,
            password: password,
        };
        const response = await Action.user_login(user);
        if (!response) {
            NotificationManager.error(translateLang("nofoundaccount_error"));

            dispatch({
                type: "auth",
                payload: {
                    isAuth: false,
                },
            });
        } else {
            var data = decode(response.data);
            let userWallet = new ethers.Wallet(data.privateKey, state.provider);
            dispatch({
                type: "auth",
                payload: {
                    isAuth: true,
                    name: data.name,
                    email: data.email,
                    bio: data.bio,
                    address: data.address,
                    privateKey: data.privateKey,
                    signer: userWallet,
                },
            });
            axios.defaults.headers.common["Authorization"] = response.data;
            NotificationManager.success(translateLang("sigin_success"));

            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        }
    };

    return (
        <div className="signin">
            <img src="./img/logo.png" width={"130px"}></img>
            <div className="signin-header">{translateLang("signin_title")}</div>
            <div className="signin-body">
                <input
                    placeholder={translateLang("signin_txt1")}
                    type={"text"}
                    onChange={(e) => {
                        userName(e.target.value);
                    }}
                ></input>
                <input
                    placeholder={translateLang("signin_txt2")}
                    type="password"
                    onChange={(e) => {
                        passWord(e.target.value);
                    }}
                ></input>
            </div>
            <div className="signin-button" onClick={() => signIn()}>
                {translateLang("signin_title")}
            </div>
            <div>
                {translateLang("signin_txt3")}{" "}
                <span
                    style={{ color: "black", cursor: "pointer" }}
                    onClick={toSignUp}
                >
                    {translateLang("signup_title")}
                </span>
            </div>
        </div>
    );
};

export default SignIn;
