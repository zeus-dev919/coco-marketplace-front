import React, { useEffect, useState } from "react";
import { useNavigate } from "@reach/router";
import { useWallet } from "use-wallet";

import MyNFT from "../components/mynfts";
import Profile from "../components/profile";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useBlockchainContext } from "../../context";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: "#212428";
  }
`;

export default function Collection() {
    const navigate = useNavigate();
    const wallet = useWallet();
    const [state, { }] = useBlockchainContext();
    const [openMenu, setOpenMenu] = useState(true);
    const [openMenu1, setOpenMenu1] = useState(false);

    useEffect(() => {
        if (wallet.status !== "connected") {
            navigate("/wallet");
        }
    }, [wallet.status]);

    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    const handleBtnClick1 = () => {
        setOpenMenu(false);
        setOpenMenu1(!openMenu1);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
    };

    return (
        <div>
            <GlobalStyles />

            <section className="container no-bottom">
                <div className="row">
                    <div className="spacer-double"></div>
                    <div className="col-md-12">
                        <div className="d_profile de-flex">
                            <div className="de-flex-col">
                                <div className="profile_avatar">
                                    <img
                                        src={
                                            state.userInfo?.image ||
                                            "img/author/author-1.jpg"
                                        }
                                        alt=""
                                    />
                                    <div className="profile_name">
                                        <h4>
                                            {state.userInfo.name}
                                            <span className="profile_username">
                                                {state.userInfo.email === ""
                                                    ? "unknown"
                                                    : state.userInfo.email}
                                            </span>
                                            <span
                                                id="wallet"
                                                className="profile_wallet"
                                            >
                                                {state.userInfo.address}
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container no-top">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="items_filter">
                            <ul className="de_nav text-left">
                                <li id="Mainbtn" className="active">
                                    <span onClick={handleBtnClick}>
                                        My NFTs
                                    </span>
                                </li>
                                <li id="Mainbtn1" className="">
                                    <span onClick={handleBtnClick1}>
                                        Profile
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {openMenu && (
                    <div id="zero1" className="onStep fadeIn">
                        <MyNFT />
                    </div>
                )}
                {openMenu1 && (
                    <div id="zero2" className="onStep fadeIn">
                        <Profile />
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
