import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Action from "../../service";
import { useBlockchainContext } from "../../context";
import decode from "jwt-decode";
import axios from "axios";

const SignIn = (props) => {
    const { auth } = props;
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [state, { dispatch }] = useBlockchainContext();

    const userName = (val) => {
        setName(val);
    }
    const passWord = (val) => {
        setPassword(val);
    }
    const toSignUp = () => {
        auth(false);
    }
    const signIn = async () => {
        var user = {
            name: name,
            password: password
        }
        const response = await Action.user_login(user);
        if (!response) {
            NotificationManager.error("Not find Account!");

            dispatch({
                type: "auth",
                payload: {
                    isAuth: false
                }
            })
        } else {
            var data = decode(response.data);
            dispatch({
                type: "auth",
                payload: {
                    isAuth: true,
                    user: data.user,
                    address: data.address,
                    email: data.email,
                    bio: data.bio,
                    privateKey: data.privateKey
                }
            })
            axios.defaults.headers.common['Authorization'] = response.data;
            NotificationManager.success("Signed In successfully!");
            navigate("/");
        }
    }

    return (
        <div className="signin">
            <img src="./img/logo.png" width={"130px"}></img>
            <div className="signin-header">Sign In</div>
            <div className="signin-body">
                <input placeholder="Please enter your UserName" type={"text"} onChange={(e) => { userName(e.target.value) }}></input>
                <input placeholder="Please enter your Password" type="password" onChange={(e) => { passWord(e.target.value) }}></input>
            </div>
            <div className="signin-button" onClick={() => signIn()}>Sign In</div>
            <div>If you don"'"t have any account <span style={{ color: "black", cursor: "pointer" }} onClick={toSignUp}>Sign Up</span></div>
        </div >
    );
}

export default SignIn;