import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import Action from "../../service";
import { useBlockchainContext } from "../../context";

const SignUp = (props) => {
    const { auth } = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [passConfirm, setConfirm] = useState("");
    const [state, { translateLang }] = useBlockchainContext();

    const userName = (val) => {
        setName(val);
    };
    const userEmail = (val) => {
        setEmail(val);
    };
    const passWord = (val) => {
        setPass(val);
    };
    const confirmPassword = (val) => {
        setConfirm(val);
    };
    const toSignIn = () => {
        auth(true);
    };
    const SignUp = async () => {
        if (
            name != "" &&
            email != "" &&
            password == passConfirm &&
            password != ""
        ) {
            var info = {
                name: name,
                email: email,
                password: password,
            };
            const upload = await Action.user_create(info);
            if (upload.status) {
                NotificationManager.success(
                    translateLang("createaccount_success")
                );
                toSignIn();
            }
        } else {
            NotificationManager.error(translateLang("checkallinfo_error"));
        }
    };

    return (
        <div className="signin" style={{ margin: "20% auto" }}>
            <img src="./img/logo.png" width={"130px"}></img>
            <div className="signin-header">{translateLang("signup_title")}</div>
            <div className="signin-body">
                <input
                    placeholder={translateLang("signin_txt1")}
                    type={"text"}
                    onChange={(e) => {
                        userName(e.target.value);
                    }}
                ></input>
                <input
                    placeholder={translateLang("signup_txt1")}
                    type="email"
                    onChange={(e) => {
                        userEmail(e.target.value);
                    }}
                ></input>
                <input
                    placeholder={translateLang("signin_txt2")}
                    type="password"
                    onChange={(e) => {
                        passWord(e.target.value);
                    }}
                ></input>
                <input
                    placeholder={translateLang("signup_txt2")}
                    type="password"
                    onChange={(e) => {
                        confirmPassword(e.target.value);
                    }}
                ></input>
            </div>
            <div className="signin-button" onClick={() => SignUp()}>
                {translateLang("signup_title")}
            </div>
            <div>
                {translateLang("signup_txt3")}{" "}
                <span
                    style={{ color: "black", cursor: "pointer" }}
                    onClick={toSignIn}
                >
                    {translateLang("signin_title")}
                </span>
            </div>
        </div>
    );
};

export default SignUp;
