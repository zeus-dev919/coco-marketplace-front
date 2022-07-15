import React, { useEffect, useState } from "react";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import moment from "moment";
import { useBlockchainContext } from "../../context";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "@reach/router";
import Action from "../../service";

export default function Responsive(props) {
    const navigate = useNavigate();
    const { id, collection } = props;
    const [state, { onsaleNFT }] = useBlockchainContext();
    const [correctCollection, setCorrectCollection] = useState(null);
    const [currency, setCurrency] = useState(state.currencies[0].value);
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initialDate = new Date();
        initialDate.setDate(initialDate.getDate() + 10);
        setDate(initialDate);
    }, []);

    useEffect(() => {
        for (let i = 0; i < state.collectionNFT.length; i++) {
            if (state.collectionNFT[i].address === collection) {
                var itemData = state.collectionNFT[i].items.find(
                    (item) => item.tokenID === id
                );
                if (!itemData) navigate("/Auction");
                else setCorrectCollection(itemData);
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
            if (id.includes("0x")) {
                Action.lazy_onsale({
                    nftAddress: collection,
                    assetId: correctCollection.tokenID,
                    currency: currency,
                    price: price,
                    expiresAt: moment(date).valueOf(),
                })
                    .then((res) => {
                        if (res.success) {
                            console.log(res);
                        } else {
                            NotificationManager.error("Listing failed");
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                    });
            } else {
                onsaleNFT({
                    nftAddress: collection,
                    assetId: correctCollection.tokenID,
                    currency: currency,
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
            }
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
                                                backgroundColor: "#ffc0c0",
                                                boxShadow: "0 0 5 0 #d05e3c",
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
                                                style={{
                                                    flex: "1 1 0",
                                                }}
                                            >
                                                <select
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setCurrency(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    {state.currencies.map(
                                                        (currency) => (
                                                            <option
                                                                value={
                                                                    currency.value
                                                                }
                                                            >
                                                                {currency.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
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
                                                        correctCollection.owner
                                                    ]?.image === undefined
                                                        ? state.collectionNFT[0]
                                                              ?.metadata.image
                                                        : state.usersInfo[
                                                              correctCollection
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
                                                    correctCollection.metadata
                                                        .image ||
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
                                                    {correctCollection?.metadata
                                                        ?.name.length > 15
                                                        ? correctCollection.metadata?.name.slice(
                                                              0,
                                                              15
                                                          ) + "..."
                                                        : correctCollection
                                                              .metadata?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    {price === ""
                                                        ? "0  Crypto-Coco"
                                                        : price?.length > 15
                                                        ? price.slice(0, 15) +
                                                          "..." +
                                                          "  Crypto-Coco"
                                                        : price +
                                                          "  Crypto-Coco"}
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
