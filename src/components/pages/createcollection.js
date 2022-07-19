import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";

import Footer from "../components/footer";
import Action from "../../service";
import { useBlockchainContext } from "../../context";

export default function CreateCollection() {
    const [state, {}] = useBlockchainContext();

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
                NotificationManager.error("please select logo image");
                return;
            }
            if (!selectedBannerFile) {
                NotificationManager.error("please select logo image");
                return;
            }
            if (name.trim() === "") {
                NotificationManager.error("please input collection name");
                return;
            }
            if (fee < 0) {
                NotificationManager.error("fee must be integer");
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
                NotificationManager.success("image uploaded");
                reset();
            } else {
                NotificationManager.error("upload failed");
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            NotificationManager.error("Collection Create failed");
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
                NotificationManager.error("image loading error");
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
                NotificationManager.error("image loading error");
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
                                    Create New Collection
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
                                    Logo Image <b style={{ color: "red" }}>*</b>
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
                                                value="Browse"
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
                                    Banner Image{" "}
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
                                            value="Browse"
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

                                <h5>Description</h5>
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

                                <h5>Percentage fee</h5>
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
                </div>
            </section>

            <Footer />
        </div>
    );
}
