import React, { useState, useEffect } from "react";
import { useNavigate } from "@reach/router";
import { useWallet } from "use-wallet";
import { NotificationManager } from "react-notifications";

import Footer from "../components/footer";
import Action from "../../service";
import { useBlockchainContext } from "../../context";

export default function Createpage() {
    const navigate = useNavigate();
    const wallet = useWallet();
    const [state, { mintNFT }] = useBlockchainContext();
    const [image, _setImage] = useState(null);
    const [selectedFile, setSeletedFile] = useState(null);
    const [name, setName] = useState("");
    const [extLink, setExtLink] = useState("");
    const [desc, setDesc] = useState("");
    const [attrItem, setAttrItem] = useState({ 0: { key: "", value: "" } });
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wallet.status !== "connected") {
            navigate("/wallet");
        }
    }, [wallet.status]);

    const handleSubmit = async () => {
        try {
            if (!selectedFile) {
                NotificationManager.error("please choose image");
                return;
            }
            if (selectedFile.size > 1024 * 1024 * 100) {
                NotificationManager.error("upload file is too big");
                return;
            }
            if (name.trim() === "") {
                NotificationManager.error("please fill name");
                document.getElementById("item_name").focus();
                return;
            }
            for (let x in attrItem) {
                if (Object.keys(attrItem).length === 1) {
                    if (attrItem[x].key === "" && attrItem[x].value === "") {
                    } else {
                        if (
                            attrItem[x].key === "" ||
                            attrItem[x].value === ""
                        ) {
                            NotificationManager.error(
                                "please fill all attribute or delete element"
                            );
                            return;
                        }
                    }
                } else {
                    if (attrItem[x].key === "" || attrItem[x].value === "") {
                        NotificationManager.error(
                            "please fill all attribute or delete element"
                        );
                        return;
                    }
                }
            }
            setLoading(true);
            var formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("name", name);
            formData.append("extlink", extLink);
            formData.append("desc", desc);
            formData.append("attribute", JSON.stringify(attrItem));

            const uploadData = await Action.nft_mint(formData);
            console.log(uploadData);
            if (uploadData.success) {
                await mintNFT(uploadData.url)
                    .then((res) => {
                        if (res) NotificationManager.success("image uploaded");
                        else NotificationManager.error("upload failed");
                        reset();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                NotificationManager.error("upload failed");
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            if (err.code === 4001) {
                NotificationManager.error("uploading rejected");
            } else {
                NotificationManager.error("operation failed");
            }

            setLoading(false);
        }
    };

    const reset = () => {
        cleanup();
        _setImage(null);
        setSeletedFile(null);
        setName("");
        setExtLink("");
        setDesc("");
        setCount(1);
        setAttrItem({ 0: { key: "", value: "" } });
    };

    const handleImgChange = async (event) => {
        if (image) {
            setImage(null);
            setSeletedFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setImage(URL.createObjectURL(newImage));
                setSeletedFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error("image loading error");
            }
        }
    };

    const cleanup = () => {
        URL.revokeObjectURL(image);
    };

    const setImage = (newImage) => {
        if (image) {
            cleanup();
        }
        _setImage(newImage);
    };

    const addItem = () => {
        setCount(count + 1);
        setAttrItem({
            ...attrItem,
            [count]: { key: "", value: "" },
        });
    };

    const deleteItem = (param) => {
        let bump = Object.assign({}, attrItem);
        if (Object.keys(attrItem).length > 1) {
            delete bump[param];
            setAttrItem(bump);
        } else {
            bump[param].key = "";
            bump[param].value = "";
            setAttrItem(bump);
        }
    };

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    Create New NFT Item
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-7 offset-lg-1 mb-5">
                        <div id="form-create-item" className="form-border">
                            <div className="field-set">
                                <h5>
                                    Upload Media{" "}
                                    <b style={{ color: "red" }}>*</b>
                                </h5>
                                <p>
                                    File types supported: all image and video
                                    Max size: 100 MB
                                </p>
                                <div className="d-create-file">
                                    <p className="file_name">
                                        {image ? (
                                            selectedFile.name
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browse">
                                        <input
                                            type="button"
                                            className="btn-main"
                                            value="Browse"
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            multiple
                                            accept="image/*, video/*"
                                            onChange={handleImgChange}
                                        />
                                    </div>
                                </div>
                                <div className="spacer-single"></div>
                                <h5>
                                    Name <b style={{ color: "red" }}>*</b>
                                </h5>
                                <input
                                    type="text"
                                    name="item_name"
                                    id="item_name"
                                    className="form-control"
                                    placeholder="your nft name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />

                                <div className="spacer-30"></div>

                                <h5>External link</h5>
                                <p>
                                    Crypto-Coco will include a link to this URL on
                                    this item's detail page, so that users can
                                    click to learn more about it. You are
                                    welcome to link to your own webpage with
                                    more details.
                                </p>
                                <input
                                    type="text"
                                    name="item_link"
                                    className="form-control"
                                    placeholder="https://yoursite.io/item/123"
                                    onChange={(e) => setExtLink(e.target.value)}
                                    value={extLink}
                                />

                                <div className="spacer-30"></div>

                                <h5>Description</h5>
                                <p>
                                    The description will be included on the
                                    item's detail page underneath its image.
                                    Markdown syntax is supported.
                                </p>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    className="form-control"
                                    placeholder="provide a detailed description of your nft item"
                                    onChange={(e) => setDesc(e.target.value)}
                                    value={desc}
                                />

                                <div className="spacer-30"></div>

                                <h5>Collection</h5>
                                <p>
                                    This is the collection where your item will
                                    appear.
                                </p>
                                <select className="form-control">
                                    <option>Crypto-Coco Art</option>
                                </select>

                                <div className="spacer-30"></div>

                                <h5>Attribute</h5>
                                <p>Textual traits that show up as rectangles</p>
                                {Object.keys(attrItem).map((item, index) => (
                                    <div className="attribute" key={index}>
                                        <button
                                            type="button"
                                            className="form-control-button"
                                            style={{ flex: "1 1 0" }}
                                            onClick={() => deleteItem(item)}
                                        >
                                            <i className="bg-color-2 i-boxed icon_close" />
                                        </button>
                                        <input
                                            type="input"
                                            className="form-control"
                                            style={{ flex: "5 5 0" }}
                                            placeholder="Character"
                                            onChange={(e) => {
                                                setAttrItem({
                                                    ...attrItem,
                                                    [item]: {
                                                        ...attrItem[item],
                                                        key: e.target.value,
                                                    },
                                                });
                                            }}
                                            value={attrItem[item].key}
                                        />
                                        <input
                                            type="input"
                                            className="form-control"
                                            style={{ flex: "5 5 0" }}
                                            placeholder="Value"
                                            onChange={(e) => {
                                                setAttrItem({
                                                    ...attrItem,
                                                    [item]: {
                                                        ...attrItem[item],
                                                        value: e.target.value,
                                                    },
                                                });
                                            }}
                                            value={attrItem[item].value}
                                        />
                                        <button
                                            type="button"
                                            className="form-control-button"
                                            style={{ flex: "1 1 0" }}
                                            onClick={addItem}
                                        >
                                            <i className="bg-color-2 i-boxed icon_plus" />
                                        </button>
                                    </div>
                                ))}

                                <div className="spacer-30"></div>
                                {!loading ? (
                                    <input
                                        type="button"
                                        id="submit"
                                        className="btn-main"
                                        value="Create Item"
                                        onClick={handleSubmit}
                                    />
                                ) : (
                                    <button className="btn-main">
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            aria-hidden="true"
                                        ></span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-12 col-xs-12">
                        <h5>Preview item</h5>
                        <div className="nft__item m-0">
                            <div className="author_list_pp">
                                <span>
                                    <img
                                        className="lazy"
                                        src={
                                            state.userInfo?.image ||
                                            "./img/author/author-1.jpg"
                                        }
                                        alt=""
                                    />
                                    <i className="fa fa-check"></i>
                                </span>
                            </div>
                            <div className="nft__item_wrap">
                                <span>
                                    <img
                                        src={
                                            image ||
                                            "./img/collections/coll-item-3.jpg"
                                        }
                                        id="get_file_2"
                                        className="lazy nft__item_preview"
                                        alt=""
                                    />
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <span>
                                    <p>
                                        {name.trim() === ""
                                            ? "unknown"
                                            : name.length > 20
                                                ? name.slice(0, 20) + "..."
                                                : name}
                                    </p>
                                </span>
                                {/* <div className="nft__item_price">
                                    <span>1/20</span>
                                </div>
                                <div className="nft__item_action">
                                    <span>Place a bid</span>
                                </div>
                                <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>50</span>
                                </div> */}
                                <div className="spacer-10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
