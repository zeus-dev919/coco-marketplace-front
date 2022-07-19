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
    const [state, { dispatch }] = useBlockchainContext();

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
            NotificationManager.error("Not find Account!");

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
            NotificationManager.success("Signed In successfully!");

            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        }
    };

    return (
        <div className="signin">
            <img src="./img/logo.png" width={"130px"}></img>
            <div className="signin-header">Sign In</div>
            <div className="signin-body">
                <input
                    placeholder="Please enter your UserName"
                    type={"text"}
                    onChange={(e) => {
                        userName(e.target.value);
                    }}
                ></input>
                <input
                    placeholder="Please enter your Password"
                    type="password"
                    onChange={(e) => {
                        passWord(e.target.value);
                    }}
                ></input>
            </div>
            <div className="signin-button" onClick={() => signIn()}>
                Sign In
            </div>
            <div>
                If you don"'"t have any account{" "}
                <span
                    style={{ color: "black", cursor: "pointer" }}
                    onClick={toSignUp}
                >
                    Sign Up
                </span>
            </div>
        </div>
    );
};

export default SignIn;
