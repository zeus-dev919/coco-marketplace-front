import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Action from "../../service";

const SignUp = (props) => {
    const { auth } = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [passConfirm, setConfirm] = useState("");

    const userName = (val) => {
        setName(val);
    }
    const userEmail = (val) => {
        setEmail(val);
    }
    const passWord = (val) => {
        setPass(val);
    }
    const confirmPassword = (val) => {
        setConfirm(val);
    }
    const toSignIn = () => {
        auth(true);
    }
    const SignUp = async () => {
        if (name != "" && email != "" && password == passConfirm && password != "") {
            var info = {
                name: name,
                email: email,
                password: password
            }
            const upload = await Action.user_create(info);
            if (upload.status) {
                NotificationManager.success("Account successfully created!");
                toSignIn();
            }
        } else {
            NotificationManager.error("Please check all Info");
        }
    }
    return (
        <div className="signin" style={{ margin: "20% auto" }}>
            <img src="./img/logo.png" width={"130px"}></img>
            <div className="signin-header">Sign Up</div>
            <div className="signin-body">
                <input placeholder="Please enter your UserName" type={"text"} onChange={(e) => { userName(e.target.value) }}></input>
                <input placeholder="AAA@gmail.com" type="email" onChange={(e) => { userEmail(e.target.value) }}></input>
                <input placeholder="Please enter your Password" type="password" onChange={(e) => { passWord(e.target.value) }}></input>
                <input placeholder="Please confirm your Password" type="password" onChange={(e) => { confirmPassword(e.target.value) }}></input>
            </div>
            <div className="signin-button" onClick={() => SignUp()}>Sign Up</div>
            <div>If you have account <span style={{ color: "black", cursor: "pointer" }} onClick={toSignIn}>Sign In</span></div>
        </div >
    );
}

export default SignUp;