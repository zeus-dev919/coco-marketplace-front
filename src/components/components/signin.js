import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Action from "../../service";
import decode from "jwt-decode";

const SignIn = (props) => {
    const { auth } = props;
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

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
        const upload = await Action.user_login(user);
        if (!upload) {
            NotificationManager.error("Not find Account!");
        } else {
            var data = decode(upload.data);
            console.log(data);
            localStorage.setItem("user", data.user);
            localStorage.setItem("public", data.publicKey);
            localStorage.setItem("private", data.privateKey);
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
            <div>If you don't have any account <span style={{ color: "black", cursor: "pointer" }} onClick={toSignUp}>Sign Up</span></div>
        </div >
    );
}

export default SignIn;