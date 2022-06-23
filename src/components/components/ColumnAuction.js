import React, { useEffect, useState } from "react";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import moment from "moment";
import { useBlockchainContext } from "../../context";
import { NotificationManager } from "react-notifications";

export default function Responsive(props) {
    const { id, collection } = props;
    const [state, { onsaleNFT }] = useBlockchainContext();
    const [correctCollection, setCorrectCollection] = useState(null);
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        for (let i = 0; i < state.collectionNFT.length; i++) {
            if (state.collectionNFT[i].address === collection) {
                setCorrectCollection(state.collectionNFT[i]);
                break;
            }
        }
    }, [state.collectionNFT]);

    const handle = (newDate) => {
        setDate(newDate);
    };

    const handlelist = async () => {
        if (price === "") return;
        if (!moment(date).isValid()) return;

        try {
            setLoading(true);
            onsaleNFT({
                nftAddress: collection,
                assetId: correctCollection.items[id].tokenID,
                price: price,
                expiresAt: moment(date).valueOf(),
            })
                .then((res) => {
                    if (res) {
                        NotificationManager.success("Successfully listing");
                    } else {
                        NotificationManager.error("Listing failed");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } catch (err) {
            console.log(err);
            NotificationManager.error("Operation failed");
        }
    };

    return (
        <>
            <section className="container" style={{ paddingTop: "20px" }}>
                {correctCollection === null ? (
                    "Loading..."
                ) : (
                    <div className="row">
                        <div className="col-lg-7 offset-lg-1 mb-5">
                            <div id="form-create-item" className="form-border">
                                <div className="field-set">
                                    <div>
                                        <h5>Method</h5>
                                        <p
                                            className="form-control"
                                            style={{
                                                backgroundColor: "#424242",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <i
                                                className="arrow_right-up"
                                                style={{
                                                    fontWeight: "bolder",
                                                }}
                                            />
                                            <span>Sell to highest bidder</span>
                                        </p>
                                        <div className="spacer-single"></div>
                                        <h5>Price</h5>
                                        <div className="price">
                                            <div
                                                className="form-control"
                                                style={{
                                                    flex: "1 1 0",
                                                }}
                                            >
                                                <img
                                                    src="../../img/logo.png"
                                                    alt=""
                                                    style={{
                                                        width: "25px",
                                                    }}
                                                />
                                                <span>ICICB</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="item_price"
                                                id="item_price"
                                                className="form-control"
                                                style={{
                                                    flex: "4 4 0",
                                                }}
                                                placeholder="Amount"
                                                value={price}
                                                onChange={(e) =>
                                                    setPrice(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="spacer-30"></div>

                                        <h5>ExpiresAt</h5>
                                        <DateTimeField
                                            dateTime={date}
                                            onChange={handle}
                                            mode={"datetime"}
                                            format={"MM/DD/YYYY hh:mm A"}
                                            inputFormat={"DD/MM/YYYY hh:mm A"}
                                            minDate={new Date()}
                                            showToday={true}
                                            startOfWeek={"week"}
                                            readonly
                                        />
                                    </div>

                                    <hr />
                                    <h5>Fees</h5>
                                    <div className="fee">
                                        <p>Service Fee</p>
                                        <p>0.2%</p>
                                    </div>

                                    <div className="spacer-40"></div>
                                    {loading ? (
                                        <button className="btn-main">
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"
                                            ></span>
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-main"
                                            disabled={
                                                price === "" ||
                                                !moment(date).isValid()
                                                    ? true
                                                    : false
                                            }
                                            onClick={handlelist}
                                        >
                                            Complete listing
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-12 col-xs-12">
                            <div style={{ position: "sticky", top: "162px" }}>
                                <h5>Preview</h5>
                                <div className="nft__item m-0">
                                    <div className="author_list_pp">
                                        <span>
                                            <img
                                                className="lazy"
                                                src={
                                                    state.usersInfo[
                                                        correctCollection.items[
                                                            id
                                                        ].owner
                                                    ]?.image === undefined
                                                        ? state.collectionNFT[0]
                                                              ?.metadata.image
                                                        : state.usersInfo[
                                                              correctCollection
                                                                  .items[id]
                                                                  .owner
                                                          ].image ||
                                                          "../../img/author/author-1.jpg"
                                                }
                                                alt=""
                                            />
                                            <i className="fa fa-check"></i>
                                        </span>
                                    </div>
                                    <div className="nft__item_wrap">
                                        <span>
                                            <img
                                                src={
                                                    correctCollection.items[id]
                                                        .metadata.image ||
                                                    "../../img/collections/coll-item-3.jpg"
                                                }
                                                id="get_file_2"
                                                className="lazy nft__item_preview"
                                                alt=""
                                            />
                                        </span>
                                    </div>
                                    <div className="nft__item_info">
                                        <div className="sell_preview">
                                            <div>
                                                <p>
                                                    {correctCollection.items[id]
                                                        ?.metadata?.name
                                                        .length > 15
                                                        ? correctCollection.items[
                                                              id
                                                          ]?.metadata?.name.slice(
                                                              0,
                                                              15
                                                          ) + "..."
                                                        : correctCollection
                                                              .items[id]
                                                              ?.metadata?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    {price === ""
                                                        ? "0  ICICB"
                                                        : price?.length > 15
                                                        ? price.slice(0, 15) +
                                                          "..." +
                                                          "  ICICB"
                                                        : price + "  ICICB"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
