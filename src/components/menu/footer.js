import React from "react";
import { Link } from "react-router-dom";
import { useBlockchainContext } from "../../context";

const Footer = () => {
    const [state, { translateLang }] = useBlockchainContext();
    return (
        <footer className="footer-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>{translateLang("marketplace")}</h5>
                            <ul>
                                <li>
                                    <Link to="/explore">
                                        {translateLang("allnfts")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Collections">
                                        {translateLang("collection")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-1">
                        <div className="widget">
                            <h5>{translateLang("resources")}</h5>
                            <ul>
                                <li>
                                    <Link to="/helpcenter">
                                        {translateLang("helpcenter")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact">
                                        {translateLang("contactus")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-xs-1">
                        <div className="widget">
                            <h5>{translateLang("newsletter")}</h5>
                            <p>{translateLang("txt1_footer")}</p>
                            <form
                                action="#"
                                className="row form-dark"
                                id="form_subscribe"
                                method="post"
                                name="form_subscribe"
                            >
                                <div className="col text-center">
                                    <input
                                        className="form-control"
                                        id="txt_subscribe"
                                        name="txt_subscribe"
                                        placeholder={translateLang(
                                            "placeholder_footer"
                                        )}
                                        type="text"
                                    />
                                    <Link to="" id="btn-subscribe">
                                        <i className="arrow_right bg-color-secondary"></i>
                                    </Link>
                                    <div className="clearfix"></div>
                                </div>
                            </form>
                            <div className="spacer-10"></div>
                            <small>{translateLang("txt2_footer")}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="subfooter">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="de-flex">
                                <div className="de-flex-col">
                                    {translateLang("powered")} Crypto-Coco.COM
                                </div>
                                <div className="de-flex-col">
                                    <div className="social-icons">
                                        <span
                                            onClick={() =>
                                                window.open("", "_self")
                                            }
                                        >
                                            <i className="fa fa-facebook fa-lg"></i>
                                        </span>
                                        <span
                                            onClick={() =>
                                                window.open("", "_self")
                                            }
                                        >
                                            <i className="fa fa-twitter fa-lg"></i>
                                        </span>
                                        <span
                                            onClick={() =>
                                                window.open("", "_self")
                                            }
                                        >
                                            <i className="fa fa-linkedin fa-lg"></i>
                                        </span>
                                        <span
                                            onClick={() =>
                                                window.open("", "_self")
                                            }
                                        >
                                            <i className="fa fa-pinterest fa-lg"></i>
                                        </span>
                                        <span
                                            onClick={() =>
                                                window.open("", "_self")
                                            }
                                        >
                                            <i className="fa fa-rss fa-lg"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
