import React from "react";
import { useParams } from "@reach/router";
import ColumnAuction from "../components/ColumnAuction";
import Footer from "../components/footer";

export default function Explore() {
    const { id, collection } = useParams();

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    List item for sale
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
