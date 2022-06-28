import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import Action from "../../service";

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

export default function Responsive() {
    const msg = "Crypto-CocoMARKET";
    const [state, { }] = useBlockchainContext();
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [image, _setImage] = useState(null);
    const [selectedFile, setSeletedFile] = useState(null);
    const [loading, setLoadItem] = useState(false);
    const [publicKey, setPublicKey] = useState("");
    const fileRef = useRef(null);

    useEffect(() => {
        init(
            state.userInfo.name,
            state.userInfo.bio,
            state.userInfo.email,
            null,
            null
        );
        setPublicKey(localStorage.getItem("public"));
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicKey);
        NotificationManager.success("address copied");
    };

    const handleSave = async () => {
        setLoadItem(true);
        const signature = await state.signer.signMessage(msg);

        if (!selectedFile) {
            NotificationManager.error("Please choose image");
            return;
        }
        var formData = new FormData();
        formData.append("newimage", selectedFile);
        formData.append("previousImage", state.userInfo.image);
        formData.append("name", newName);
        formData.append("bio", newBio);
        formData.append("email", newEmail);
        formData.append("msg", msg);
        formData.append("signature", signature);

        Action.user_update(formData)
            .then((res) => {
                if (res) {
                    init("", "", "", null, null);
                }
            })
            .catch((err) => {
                console.log(err);
            });
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

    return (
        <div className="row">
            <div className="col-lg-5 col-md-6 col-sm-6 col-xs-12">
                <div className="field-set">
                    <h5>Username</h5>
                    <input
                        type="text"
                        name="item_name"
                        id="item_name"
                        className="form-control"
                        placeholder="your name"
                        onChange={(e) => setNewName(e.target.value)}
                        value={newName}
                    />

                    <div className="spacer-10"></div>

                    <h5>Bio</h5>
                    <textarea
                        name="item_bio"
                        id="item_bio"
                        className="form-control"
                        placeholder="your bio details"
                        onChange={(e) => setNewBio(e.target.value)}
                        value={newBio}
                    />

                    <div className="spacer-10"></div>

                    <h5>Email Address</h5>
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

                    <h5>Wallet Address</h5>
                    <div
                        className="text_copy noselect"
                        style={{ color: "grey", textAlign: "left" }}
                        onClick={handleCopy}
                    >
                        <span>{publicKey}</span>
                        <span style={{ padding: "0 10px" }}>
                            <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                        </span>
                    </div>

                    <div className="spacer-20"></div>

                    <input
                        type="button"
                        id="submit"
                        className="btn-main"
                        value="Save"
                        onClick={handleSave}
                        disabled={loading}
                    />

                    <div className="spacer-30"></div>
                </div>
            </div>
            <div className="col-1"></div>
            <div className="d-item col-lg-4 col-md-5 col-sm-5 col-xs-12">
                <div className="nft__item">
                    <div className="nft__item_wrap">
                        <Outer>
                            <img
                                src={image || "./img/author/author-1.jpg"}
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
        </div>
    );
}
