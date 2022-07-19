import React from "react";
import { Link } from "react-router-dom";

const footer = () => (
    <footer className="footer-light">
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-sm-6 col-xs-1">
                    <div className="widget">
                        <h5>Marketplace</h5>
                        <ul>
                            <li>
                                <Link to="/explore">All NFTs</Link>
                            </li>
                            <li>
                                <Link to="/colection">Collections</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-4 col-sm-6 col-xs-1">
                    <div className="widget">
                        <h5>Resources</h5>
                        <ul>
                            <li>
                                <Link to="/helpcenter">Help Center</Link>
                            </li>
                            <li>
                                <Link to="/news">Newsletter</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-3 col-sm-12 col-xs-1">
                    <div className="widget">
                        <h5>Newsletter</h5>
                        <p>
                            Signup for our newsletter to get the latest news in
                            your inbox.
                        </p>
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
                                    placeholder="enter your email"
                                    type="text"
                                />
                                <Link to="" id="btn-subscribe">
                                    <i className="arrow_right bg-color-secondary"></i>
                                </Link>
                                <div className="clearfix"></div>
                            </div>
                        </form>
                        <div className="spacer-10"></div>
                        <small>
                            Your email is safe with us. We don't spam.
                        </small>
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
                                powered by Crypto-Coco-GROUP.COM
                            </div>
                            <div className="de-flex-col">
                                <div className="social-icons">
                                    <span
                                        onClick={() => window.open("", "_self")}
                                    >
                                        <i className="fa fa-facebook fa-lg"></i>
                                    </span>
                                    <span
                                        onClick={() => window.open("", "_self")}
                                    >
                                        <i className="fa fa-twitter fa-lg"></i>
                                    </span>
                                    <span
                                        onClick={() => window.open("", "_self")}
                                    >
                                        <i className="fa fa-linkedin fa-lg"></i>
                                    </span>
                                    <span
                                        onClick={() => window.open("", "_self")}
                                    >
                                        <i className="fa fa-pinterest fa-lg"></i>
                                    </span>
                                    <span
                                        onClick={() => window.open("", "_self")}
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
export default footer;
