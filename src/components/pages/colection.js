import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import ColumnZero from "../components/ColumnZero";
import CoulmnOne from "../components/CoulmnOne";
import Footer from "../components/footer";
import { useBlockchainContext } from "../../context";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #ecbdb0;
  }
`;

export default function Collection() {
    const { collection } = useParams();
    const [state, {}] = useBlockchainContext();
    const [openMenu, setOpenMenu] = useState(true);
    const [correctItem, setCorrectItem] = useState(null);
    const [owners, setOwners] = useState([]);
    const [avgAmount, setAvgAmount] = useState(0);

    useEffect(() => {
        state.collectionNFT.map((item) => {
            if (item.address === collection) {
                setCorrectItem(item);
                return;
            }
        });
    }, [collection]);

    useEffect(() => {
        if (correctItem !== null) {
            let bump = [];
            let count = 0;
            let sum = 0;
            for (let i = 0; i < correctItem.items.length; i++) {
                if (bump.indexOf(correctItem.items[i].owner) === -1) {
                    bump.push(correctItem.items[i].owner);
                }
                if (correctItem.items[i].marketdata.price !== "") {
                    sum += Number(correctItem.items[i].marketdata.price);
                    count++;
                }
            }
            setOwners(bump);
            setAvgAmount(sum / count / 1000);
        }
    }, [correctItem]);

    const handleBtnClick = () => {
        setOpenMenu(true);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };

    const handleBtnClick1 = () => {
        setOpenMenu(false);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
    };

    return (
        <div>
            <GlobalStyles />

            <section
                id="profile_banner"
                className="jumbotron breadcumb no-bg"
                style={{
                    backgroundImage: `url(${correctItem?.metadata?.coverImage})`,
                }}
            >
                <div className="mainbreadcumb"></div>
            </section>

            {correctItem !== null ? (
                <div>
                    <section className="container d_coll no-top no-bottom">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="d_profile">
                                    <div className="profile_avatar">
                                        <div className="d_profile_img">
                                            <img
                                                src={correctItem.metadata.image}
                                                alt=""
                                            />
                                            <i className="fa fa-check"></i>
                                        </div>

                                        <div className="profile_name">
                                            <h4>
                                                {correctItem.metadata.name}
                                                <div className="clearfix"></div>
                                                <span
                                                    id="wallet"
                                                    className="profile_wallet"
                                                >
                                                    {correctItem.address}
                                                </span>
                                                <button
                                                    id="btn_copy"
                                                    title="Copy Text"
                                                >
                                                    Copy
                                                </button>
                                            </h4>
                                        </div>

                                        <div className="collection_info">
                                            <p className="text-center">
                                                by{" "}
                                                <b className="color">
                                                    Crypto-Coco
                                                </b>
                                            </p>
                                            <div className="spacer-10"></div>
                                            <span>
                                                <div>
                                                    <h3>
                                                        {
                                                            correctItem.items
                                                                .length
                                                        }
                                                    </h3>
                                                    <p>items</p>
                                                </div>
                                                <div>
                                                    <h3>{owners.length}</h3>
                                                    <p>owners</p>
                                                </div>
                                                <div>
                                                    <h3>
                                                        {isNaN(avgAmount)
                                                            ? 0
                                                            : avgAmount.toFixed(
                                                                  2
                                                              )}
                                                        K
                                                    </h3>
                                                    <p>floor price</p>
                                                </div>
                                            </span>
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
                                    <ul className="de_nav">
                                        <li id="Mainbtn" className="active">
                                            <span onClick={handleBtnClick}>
                                                onSaled
                                            </span>
                                        </li>
                                        <li id="Mainbtn1" className="">
                                            <span onClick={handleBtnClick1}>
                                                Owned
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {openMenu ? (
                            <div id="zero1" className="onStep fadeIn">
                                <ColumnZero correctItem={correctItem} />
                            </div>
                        ) : (
                            <div id="zero2" className="onStep fadeIn">
                                <CoulmnOne correctItem={correctItem} />
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                "Loading..."
            )}

            <Footer />
        </div>
    );
}
