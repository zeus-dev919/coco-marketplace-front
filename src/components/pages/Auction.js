import React from "react";
import { useParams } from "react-router-dom";
import ColumnAuction from "../components/ColumnAuction";
import Footer from "../menu/footer";
import { useBlockchainContext } from "../../context";

export default function Explore() {
    const { id, collection } = useParams();
    const [state, { translateLang }] = useBlockchainContext();

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    {translateLang("onsale_title")}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <ColumnAuction collection={collection} id={id} />
            </section>

            <Footer />
        </div>
    );
}
