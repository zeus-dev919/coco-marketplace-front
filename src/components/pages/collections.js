import React from "react";
import Footer from "../menu/footer";
import { useNavigate } from "react-router-dom";
import { useBlockchainContext } from "../../context";

export default function Collections() {
    const [state, { translateLang }] = useBlockchainContext();
    const navigate = useNavigate();

    const handle = (address) => {
        navigate(`/collection/${address}`);
    };

    return (
        <>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="row m-10-hor">
                        <div className="col-12 text-center">
                            <h1>{translateLang("allcollection_title")}</h1>
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
                                        {translateLang("by")}{" "}
                                        <b className="color">
                                            {item.metadata.fee_recipent.slice(
                                                0,
                                                5
                                            ) +
                                                "..." +
                                                item.metadata.fee_recipent.slice(
                                                    -4
                                                )}
                                        </b>
                                    </p>
                                    <div className="spacer-10"></div>
                                    <p className="card-text text-center">
                                        {item.metadata.description === ""
                                            ? "No description"
                                            : item.metadata.description}
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
