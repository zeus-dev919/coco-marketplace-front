import React from "react";
import { createGlobalStyle } from "styled-components";
import Footer from "../components/footer";
import { useNavigate } from "@reach/router";
import { useBlockchainContext } from "../../context";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #ecbdb0;
  }
`;

export default function Collections() {
    const [state, { }] = useBlockchainContext();
    const navigate = useNavigate();

    const handle = (address) => {
        navigate(`/collection/${address}`);
    };

    return (
        <>
            <GlobalStyles />

            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="row m-10-hor">
                        <div className="col-12 text-center">
                            <h1>Explore Collections</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    {state.collectionNFT.map((item, index) => (
                        <div
                            className="col-lg-4 col-md-6 mb30"
                            key={index}
                            onClick={() => handle(item.address)}
                        >
                            <div className="card">
                                <div>
                                    <img
                                        src={item.metadata.coverImage}
                                        className="card-img-top"
                                        alt=""
                                    />
                                </div>
                                <div className="card-body">
                                    <span>
                                        <img
                                            className="lazy"
                                            src={item.metadata.image}
                                            alt=""
                                        />
                                    </span>
                                    <div className="spacer-10"></div>
                                    <h4 className="card-title text-center">
                                        {item.metadata.name}
                                    </h4>
                                    <p className="text-center">
                                        by <b className="color">Crypto-Coco</b>
                                    </p>
                                    <div className="spacer-10"></div>
                                    <p className="card-text text-center">
                                        {item.metadata.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="spacer-single"></div>
            </section>

            <Footer />
        </>
    );
}
