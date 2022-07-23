import React, { useState } from "react";
import { NotificationManager } from "react-notifications";

import Footer from "../menu/footer";
import Action from "../../service";
import { useBlockchainContext } from "../../context";

export default function CreateCollection() {
    const [state, { translateLang }] = useBlockchainContext();

    const [logoImage, _setLogoImage] = useState(null);
    const [selectedLogoFile, setSeletedLogoFile] = useState(null);
    const [bannerImage, _setBannerImage] = useState(null);
    const [selectedBannerFile, setSeletedBannerFile] = useState(null);
    const [name, setName] = useState("");
    const [extLink, setExtLink] = useState("");
    const [desc, setDesc] = useState("");
    const [fee, setFee] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            if (!selectedLogoFile) {
                NotificationManager.error(translateLang("chooselogo_error"));
                return;
            }
            if (!selectedBannerFile) {
                NotificationManager.error(translateLang("choosebanner_error"));
                return;
            }
            if (name.trim() === "") {
                NotificationManager.error(
                    translateLang("fillcollection_error")
                );
                return;
            }
            if (fee < 0) {
                NotificationManager.error(translateLang("fillfee_error"));
                return;
            }
            setLoading(true);
            var formData = new FormData();
            formData.append("logoImage", selectedLogoFile);
            formData.append("bannerImage", selectedBannerFile);
            formData.append("name", name.trim());
            formData.append("extUrl", extLink.trim());
            formData.append("desc", desc.trim());
            formData.append("fee", fee);

            const uploadData = await Action.create_collection(formData);
            if (uploadData) {
                NotificationManager.success(
                    translateLang("createcollection_success")
                );
                reset();
            } else {
                NotificationManager.error(
                    translateLang("createcollection_error")
                );
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            NotificationManager.error(translateLang("operation_error"));
        }
    };

    const reset = () => {
        cleanup();
        _setLogoImage(null);
        _setBannerImage(null);
        setSeletedLogoFile(null);
        setSeletedBannerFile(null);
        setName("");
        setExtLink("");
        setDesc("");
    };

    const handleLogoImgChange = async (event) => {
        if (logoImage) {
            setLogoImage(null);
            setSeletedLogoFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setLogoImage(URL.createObjectURL(newImage));
                setSeletedLogoFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error(translateLang("imageloading_error"));
            }
        }
    };

    const handleBannerImgChange = async (event) => {
        if (bannerImage) {
            setBannerImage(null);
            setSeletedBannerFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setBannerImage(URL.createObjectURL(newImage));
                setSeletedBannerFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error(translateLang("imageloading_error"));
            }
        }
    };

    const cleanup = (index) => {
        if (index === 1) {
            URL.revokeObjectURL(logoImage);
        } else {
            URL.revokeObjectURL(bannerImage);
        }
    };

    const setLogoImage = (newImage) => {
        if (logoImage) {
            cleanup(1);
        }
        _setLogoImage(newImage);
    };

    const setBannerImage = (newImage) => {
        if (bannerImage) {
            cleanup(2);
        }
        _setBannerImage(newImage);
    };

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    {translateLang("createcollection_title")}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1 mb-5">
                        <div id="form-create-item" className="form-border">
                            <div className="field-set">
                                <h5>
                                    {translateLang("logoimage")}{" "}
                                    <b style={{ color: "red" }}>*</b>
                                </h5>
                                <p>
                                    This image will also be used for navigation.
                                    350 * 350 recommended.
                                </p>
                                <div className="c-create-file">
                                    <p className="file_name">
                                        {logoImage ? (
                                            <div className="mask">
                                                <img src={logoImage} alt="" />
                                            </div>
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browser_button">
                                        <div className="browse">
                                            <input
                                                type="button"
                                                className="btn-main"
                                                value={translateLang("browse")}
                                            />
                                            <input
                                                id="upload_file"
                                                type="file"
                                                multiple
                                                accept="image/*, video/*"
                                                onChange={handleLogoImgChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="spacer-single"></div>

                                <h5>
                                    {translateLang("bannerimage")}{" "}
                                    <b style={{ color: "red" }}>*</b>
                                </h5>
                                <p>
                                    This image will appear at the top of your
                                    collection page. Avoid including too much
                                    text in this banner image, as the dimensions
                                    change on different devices. 1400 * 350
                                    recommended.
                                </p>
                                <div className="d-create-file">
                                    <p className="file_name">
                                        {bannerImage ? (
                                            <img src={bannerImage} alt="" />
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browse">
                                        <input
                                            type="button"
                                            className="btn-main"
                                            value={translateLang("browse")}
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            multiple
                                            accept="image/*, video/*"
                                            onChange={handleBannerImgChange}
                                        />
                                    </div>
                                </div>

                                <div className="spacer-single"></div>
                                <h5>
                                    {translateLang("name")}{" "}
                                    <b style={{ color: "red" }}>*</b>
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

                                <h5>{translateLang("externallink")}</h5>
                                <p>
                                    Crypto-Coco will include a link to this URL
                                    on this item"'"s detail page, so that users
                                    can click to learn more about it. You are
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

                                <h5>{translateLang("description")}</h5>
                                <p>
                                    The description will be included on the
                                    item"'"s detail page underneath its image.
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

                                <h5>{translateLang("percentagefee")}</h5>
                                <p>
                                    Collect a fee when a user re-sells an item
                                    you originally created. This is deducted
                                    from the final sale price and paid monthly
                                    to a payout address of your choosing.
                                </p>
                                <input
                                    type="number"
                                    name="item_link"
                                    className="form-control"
                                    placeholder="e.g. 2.5"
                                    onChange={(e) => setFee(e.target.value)}
                                    value={fee}
                                />

                                <div className="spacer-30"></div>
                                {!loading ? (
                                    <input
                                        type="button"
                                        id="submit"
                                        className="btn-main"
                                        value={translateLang("btn_createitem")}
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
                </div>
            </section>

            <Footer />
        </div>
    );
}
