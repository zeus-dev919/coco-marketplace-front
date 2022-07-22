import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import axios from "axios";
import { copyToClipboard } from "../../utils";

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

export default function Responsive() {
    const [
        state,
        { dispatch, updateAuth, checkBalances, setLanguage, translateLang },
    ] = useBlockchainContext();
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [image, _setImage] = useState(null);
    const [selectedFile, setSeletedFile] = useState(null);
    const [loading, setLoadItem] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showPri, setShowPri] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        init(
            state.userInfo.name,
            state.userInfo.bio ? state.userInfo.bio : "",
            state.userInfo.email,
            null,
            null
        );
        let tokenlist = state.currencies.map((currency) => currency.value);
        checkBalances(tokenlist);
    }, []);

    const setLang = (e) => {
        setLanguage({ newLang: e.target.value });
    };

    const handleaddressCopy = () => {
        copyToClipboard(state.auth.address)
            .then((res) => {
                NotificationManager.success("address copied");
            })
            .catch((err) => {
                NotificationManager.success(err.message);
            });
    };
    const handleprivateCopy = () => {
        copyToClipboard(state.auth.privateKey)
            .then((res) => {
                NotificationManager.success("privatekey copied");
            })
            .catch((err) => {
                NotificationManager.success(err.message);
            });
    };

    const handleSave = async () => {
        setLoadItem(true);
        try {
            if (!selectedFile) {
                throw new Error("Please choose image");
            }
            var formData = new FormData();
            formData.append("newimage", selectedFile);
            formData.append("previousImage", state.userInfo.image);
            formData.append("name", newName);
            formData.append("bio", newBio);
            formData.append("email", newEmail);

            var res = await axios.post("/api/user-update", formData);
            updateAuth(res.data.data);

            NotificationManager.success("Update success");
        } catch (err) {
            console.log(err.message);
            NotificationManager.error(err.message);
            setLoadItem(false);
        }
        setLoadItem(false);
    };

    const init = (p1, p2, p3, p4, p5) => {
        setNewName(p1);
        setNewBio(p2);
        setNewEmail(p3);
        _setImage(p4);
        setSeletedFile(p5);
    };

    const handleSelect = () => {
        fileRef.current.click();
    };

    const handleImgChange = async (event) => {
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                _setImage(URL.createObjectURL(newImage));
                setSeletedFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error("image loading error");
            }
        }
    };

    const editOnclick = () => {
        setEdit(!edit);
    };

    const showPrivateKey = () => {
        setShowPri(!showPri);
    };

    return (
        <div className="row">
            <div className="col-lg-5 col-md-6 col-sm-6 col-xs-12">
                <div className="field-set">
                    <h5>{translateLang("mybalance")}</h5>
                    <select className="form-control">
                        {state.currencies.map((item, index) => (
                            <option selected={index === 0 ? true : false}>
                                {Number(state.balances[index]).toFixed(2)}
                                {"  "}
                                {item.label}
                                {"   "}(
                                {Number(
                                    state.balances[index] *
                                        state.tokenPrice[item.label]
                                ).toFixed(2) + "$"}
                                )
                            </option>
                        ))}
                    </select>
                    <div className="spacer-20"></div>
                    <h5>{translateLang("walletaddress")}</h5>
                    <div
                        className="text_copy noselect"
                        style={{ color: "grey", textAlign: "left" }}
                        onClick={handleaddressCopy}
                    >
                        <span>{state.auth.address}</span>
                        <span style={{ padding: "0 10px" }}>
                            <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                        </span>
                    </div>
                    {showPri ? (
                        <>
                            <h5>{translateLang("privatekey")}</h5>
                            <div
                                className="text_copy noselect"
                                style={{ color: "grey", textAlign: "left" }}
                                onClick={handleprivateCopy}
                            >
                                <span>{state.auth.privateKey}</span>
                                <span style={{ padding: "0 10px" }}>
                                    <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                                </span>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                    <div className="spacer-20"></div>

                    <h5>{translateLang("language")}</h5>
                    <select
                        className="form-control"
                        onChange={(e) => setLang(e)}
                    >
                        <option
                            value="en"
                            selected={state.lang === "en" && true}
                        >
                            EN
                        </option>
                        <option
                            value="jp"
                            selected={state.lang === "jp" && true}
                        >
                            JP
                        </option>
                    </select>

                    <div className="spacer-20"></div>
                    {edit ? (
                        <>
                            <h5>{translateLang("username")}</h5>
                            <input
                                type="text"
                                name="item_name"
                                id="item_name"
                                className="form-control"
                                placeholder="your name"
                                onChange={(e) => setNewName(e.target.value)}
                                value={newName}
                            />

                            <div className="spacer-20"></div>

                            <h5>{translateLang("bio")}</h5>
                            <textarea
                                name="item_bio"
                                id="item_bio"
                                className="form-control"
                                placeholder="your bio details"
                                onChange={(e) => setNewBio(e.target.value)}
                                value={newBio}
                            />

                            <div className="spacer-20"></div>

                            <h5>{translateLang("emailaddress")}</h5>
                            <input
                                type="text"
                                name="item_email"
                                id="item_email"
                                className="form-control"
                                placeholder="your bio details"
                                onChange={(e) => setNewEmail(e.target.value)}
                                value={newEmail}
                            />

                            <div className="spacer-10"></div>

                            <input
                                type="button"
                                id="submit"
                                className="btn-main"
                                value={translateLang("btn_save")}
                                onClick={handleSave}
                                disabled={loading}
                            />

                            <div className="spacer-30"></div>
                        </>
                    ) : (
                        <>
                            <h5>{translateLang("username")}</h5>
                            <div className="userInfo_input">
                                {state.auth?.name}
                            </div>

                            {state.auth?.bio ? (
                                <div>
                                    <h5>{translateLang("bio")}</h5>
                                    <div className="userInfo_input">
                                        {state.auth?.bio}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}

                            <h5>{translateLang("emailaddress")}</h5>
                            <div className="userInfo_input">
                                {state.auth?.email}
                            </div>

                            <div className="spacer-10"></div>
                        </>
                    )}

                    <div style={{ display: "flex" }}>
                        <div
                            className="profile-btn"
                            style={{ marginRight: "10px" }}
                            onClick={editOnclick}
                        >
                            {translateLang("btn_edit")}
                        </div>
                        <div className="profile-btn" onClick={showPrivateKey}>
                            {translateLang("btn_exportprivatekey")}
                        </div>
                    </div>
                    <div className="spacer-20"></div>
                </div>
            </div>
            <div className="col-1"></div>
            {edit ? (
                <>
                    <div className="d-item col-lg-4 col-md-5 col-sm-5 col-xs-12">
                        <div className="nft__item">
                            <div className="nft__item_wrap">
                                <Outer>
                                    <img
                                        src={
                                            image || "./img/author/author-1.jpg"
                                        }
                                        className="lazy nft__item_preview noselect"
                                        alt=""
                                        onClick={handleSelect}
                                    />
                                    <input
                                        ref={fileRef}
                                        id="fileUpload"
                                        type="file"
                                        multiple
                                        accept="image/*, video/*"
                                        onChange={handleImgChange}
                                        className="fileUpload"
                                    />
                                </Outer>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="col-lg-4 col-md-5 col-sm-5 col-xs-12">
                    <div className="nft__item">
                        <div className="nft__item_wrap">
                            <Outer>
                                <img
                                    src={image || "./img/author/author-1.jpg"}
                                    className="lazy nft__item_preview noselect"
                                    alt=""
                                />
                            </Outer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
