import React, { useEffect, useState } from "react";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import moment from "moment";
import { useBlockchainContext } from "../../context";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import Action from "../../service";
import { toBigNum } from "../../utils";
import ConfirmModal from "./ConfirmModal";
import { ethers } from "ethers";

export default function OnSale(props) {
    const navigate = useNavigate();
    const { id, collection } = props;
    const [
        state,
        {
            onsaleNFT,
            onsaleLazyNFT,
            translateLang,
            approveNFT,
            onSaleGas,
            ApproveNFTGas,
            onLazySaleGas,
            checkNFTApprove,
        },
    ] = useBlockchainContext();
    const [correctCollection, setCorrectCollection] = useState(null);
    const [currency, setCurrency] = useState(state.currencies[0].value);
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date());
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [approveFlag, setApproveFlag] = useState(false);
    const [autionFlag, setAuctionFlag] = useState(false);

    useEffect(() => {
        const initialDate = new Date();
        initialDate.setDate(initialDate.getDate() + 10);
        setDate(initialDate);
    }, []);

    useEffect(() => {
        (async () => {
            setApproveFlag(correctCollection?.isOffchain);
            if (correctCollection !== null && !correctCollection.isOffchain) {
                const validation = await checkNFTApprove({
                    assetId: correctCollection.tokenID,
                    nftAddress: collection,
                });
                setApproveFlag(validation);
            }
        })();
    }, [correctCollection]);

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
        try {
            if (autionFlag) {
                if (!moment(date).isValid()) {
                    NotificationManager.warning("Check Expired Date");
                    return;
                }
                setModalShow(false);
                setLoading(true);
                if (!correctCollection.isOffchain) {
                    let txOnSale = await onsaleNFT({
                        nftAddress: collection,
                        assetId: correctCollection.tokenID,
                        currency: currency,
                        price: ethers.constants.MaxUint256,
                        expiresAt: moment(date).valueOf(),
                    });

                    if (txOnSale) {
                        NotificationManager.success(
                            translateLang("listing_success")
                        );
                        navigate("/explore");
                    } else
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                    setLoading(false);
                } else {
                    const lazyAction = await Action.lazy_onsale({
                        nftAddress: collection,
                        assetId: correctCollection.tokenID,
                        priceGwei: ethers.constants.MaxUint256,
                        expiresAt: moment(date).valueOf(),
                    });

                    if (!lazyAction.success) {
                        setLoading(false);
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                        return;
                    }

                    let txOnSale = await onsaleLazyNFT({
                        tokenId: correctCollection.tokenID,
                        priceGwei: ethers.constants.MaxUint256,
                        currency: currency,
                        expiresAt: moment(date).valueOf(),
                        singature: lazyAction.result,
                    });

                    if (txOnSale) {
                        NotificationManager.success(
                            translateLang("listing_success")
                        );
                        navigate("/explore");
                    } else
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                    setLoading(false);
                }
            } else {
                if (price === "") {
                    NotificationManager.warning("Enter the price");
                    return;
                }
                if (!moment(date).isValid()) {
                    NotificationManager.warning("Check Expired Date");
                    return;
                }
                setModalShow(false);
                setLoading(true);
                if (!correctCollection.isOffchain) {
                    let txOnSale = await onsaleNFT({
                        nftAddress: collection,
                        assetId: correctCollection.tokenID,
                        currency: currency,
                        price: toBigNum(price, 18),
                        expiresAt: moment(date).valueOf(),
                    });

                    if (txOnSale) {
                        NotificationManager.success(
                            translateLang("listing_success")
                        );
                        navigate("/explore");
                    } else
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                    setLoading(false);
                } else {
                    const lazyAction = await Action.lazy_onsale({
                        nftAddress: collection,
                        assetId: correctCollection.tokenID,
                        priceGwei: toBigNum(price, 18),
                        expiresAt: moment(date).valueOf(),
                    });

                    if (!lazyAction.success) {
                        setLoading(false);
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                        return;
                    }

                    let txOnSale = await onsaleLazyNFT({
                        tokenId: correctCollection.tokenID,
                        priceGwei: toBigNum(price, 18),
                        currency: currency,
                        expiresAt: moment(date).valueOf(),
                        singature: lazyAction.result,
                    });

                    if (txOnSale) {
                        NotificationManager.success(
                            translateLang("listing_success")
                        );
                        navigate("/explore");
                    } else
                        NotificationManager.error(
                            translateLang("listingerror")
                        );
                    setLoading(false);
                }
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            NotificationManager.error(translateLang("operation_error"));
        }
    };

    const ListGas = async () => {
        let gas = 0;
        if (correctCollection.isOffchain) {
            const lazyAction = await Action.lazy_onsale({
                nftAddress: collection,
                assetId: correctCollection.tokenID,
                priceGwei: toBigNum("1", 18),
                expiresAt: moment(date).valueOf(),
            });

            gas = await onLazySaleGas({
                tokenId: correctCollection.tokenID,
                priceGwei: toBigNum("1", 18),
                currency: currency,
                expiresAt: moment(date).valueOf(),
                singature: lazyAction.result,
            });
        } else {
            gas = await onSaleGas({
                nftAddress: collection,
                assetId: correctCollection.tokenID,
                currency: currency,
                price: "1",
                expiresAt: moment(date).valueOf(),
            });
        }

        return gas;
    };

    const handleApprove = async () => {
        setModalShow(false);
        setLoading(true);
        let txOnSale = await approveNFT({
            nftAddress: collection,
            assetId: correctCollection.tokenID,
        });

        if (txOnSale) {
            NotificationManager.success("Successfully Approve");
            setApproveFlag(true);
        } else NotificationManager.error("Failed Approve");
        setLoading(false);
    };

    const ApproveGas = async () => {
        if (correctCollection) {
            let gas = await ApproveNFTGas({
                nftAddress: collection,
                assetId: correctCollection.tokenID,
            });

            return gas;
        }
    };

    return (
        <>
            <div>
                {correctCollection === null ? (
                    "Loading..."
                ) : (
                    <div className="row">
                        <div className="col-lg-7 offset-lg-1 mb-5">
                            <div id="form-create-item" className="form-border">
                                <div className="field-set">
                                    <Tab.Container
                                        id="left-tabs-example"
                                        defaultActiveKey="first"
                                    >
                                        <Row>
                                            <Col sm={12}>
                                                <Nav variant="pills" fill>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            eventKey="first"
                                                            onClick={() =>
                                                                setAuctionFlag(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Fixed Price
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            eventKey="second"
                                                            onClick={() =>
                                                                setAuctionFlag(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Auction
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </Col>
                                            <Col sm={12}>
                                                <br />
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="first">
                                                        <div>
                                                            <h5>
                                                                {translateLang(
                                                                    "method"
                                                                )}
                                                            </h5>
                                                            <p
                                                                className="form-control"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#ffc0c0",
                                                                    boxShadow:
                                                                        "0 0 5 0 #d05e3c",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "10px",
                                                                }}
                                                            >
                                                                <i
                                                                    className="arrow_right-up"
                                                                    style={{
                                                                        fontWeight:
                                                                            "bolder",
                                                                    }}
                                                                />
                                                                <span>
                                                                    {translateLang(
                                                                        "sellnote"
                                                                    )}
                                                                </span>
                                                            </p>
                                                            <div className="spacer-single"></div>
                                                            <h5>
                                                                {translateLang(
                                                                    "sellprice"
                                                                )}
                                                            </h5>
                                                            <div className="price">
                                                                <div
                                                                    style={{
                                                                        flex: "1 1 0",
                                                                    }}
                                                                >
                                                                    <select
                                                                        className="form-control"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setCurrency(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {state.currencies.map(
                                                                            (
                                                                                currency,
                                                                                index
                                                                            ) => (
                                                                                <option
                                                                                    value={
                                                                                        currency.value
                                                                                    }
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currency.label
                                                                                    }
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
                                                                    placeholder={translateLang(
                                                                        "amount"
                                                                    )}
                                                                    value={
                                                                        price
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setPrice(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="spacer-single"></div>
                                                            <h5>
                                                                {translateLang(
                                                                    "expiredate"
                                                                )}
                                                            </h5>
                                                            <DateTimeField
                                                                dateTime={date}
                                                                onChange={
                                                                    handle
                                                                }
                                                                mode={
                                                                    "datetime"
                                                                }
                                                                format={
                                                                    "MM/DD/YYYY hh:mm A"
                                                                }
                                                                inputFormat={
                                                                    "DD/MM/YYYY hh:mm A"
                                                                }
                                                                minDate={
                                                                    new Date()
                                                                }
                                                                showToday={true}
                                                                startOfWeek={
                                                                    "week"
                                                                }
                                                                readonly
                                                            />
                                                        </div>
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="second">
                                                        <div>
                                                            <h5>
                                                                {translateLang(
                                                                    "method"
                                                                )}
                                                            </h5>
                                                            <p
                                                                className="form-control"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#ffc0c0",
                                                                    boxShadow:
                                                                        "0 0 5 0 #d05e3c",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "10px",
                                                                }}
                                                            >
                                                                <i
                                                                    className="arrow_right-up"
                                                                    style={{
                                                                        fontWeight:
                                                                            "bolder",
                                                                    }}
                                                                />
                                                                <span>
                                                                    {translateLang(
                                                                        "sellnote"
                                                                    )}
                                                                </span>
                                                            </p>
                                                            <div className="spacer-single"></div>
                                                            <h5>
                                                                {translateLang(
                                                                    "sellprice"
                                                                )}
                                                            </h5>
                                                            <div className="price">
                                                                <div
                                                                    style={{
                                                                        flex: "1 1 0",
                                                                    }}
                                                                >
                                                                    <select
                                                                        className="form-control"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setCurrency(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {state.currencies.map(
                                                                            (
                                                                                currency,
                                                                                index
                                                                            ) => (
                                                                                <option
                                                                                    value={
                                                                                        currency.value
                                                                                    }
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currency.label
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="spacer-30"></div>
                                                            <h5>
                                                                {translateLang(
                                                                    "expiredate"
                                                                )}
                                                            </h5>
                                                            <DateTimeField
                                                                dateTime={date}
                                                                onChange={
                                                                    handle
                                                                }
                                                                mode={
                                                                    "datetime"
                                                                }
                                                                format={
                                                                    "MM/DD/YYYY hh:mm A"
                                                                }
                                                                inputFormat={
                                                                    "DD/MM/YYYY hh:mm A"
                                                                }
                                                                minDate={
                                                                    new Date()
                                                                }
                                                                showToday={true}
                                                                startOfWeek={
                                                                    "week"
                                                                }
                                                                readonly
                                                            />
                                                        </div>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className="spacer-40"></div>
                                        {loading ? (
                                            <button className="btn-main">
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    aria-hidden="true"
                                                ></span>
                                            </button>
                                        ) : approveFlag ||
                                          correctCollection.isOffchain ? (
                                            <button
                                                className="btn-main"
                                                onClick={() =>
                                                    setModalShow(true)
                                                }
                                            >
                                                {translateLang(
                                                    "btn_completelisting"
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-main"
                                                onClick={() =>
                                                    setModalShow(true)
                                                }
                                            >
                                                {"Approve"}
                                            </button>
                                        )}
                                    </Tab.Container>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-12 col-xs-12">
                            <div style={{ position: "sticky", top: "162px" }}>
                                <h5>{translateLang("previewitem")}</h5>
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
                                                        ? "0  ETH"
                                                        : price?.length > 15
                                                        ? price.slice(0, 15) +
                                                          "..." +
                                                          "  ETH"
                                                        : price + "  ETH"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {modalShow && (
                <ConfirmModal
                    show={modalShow}
                    setShow={setModalShow}
                    actionFunc={approveFlag ? handlelist : handleApprove}
                    estimateFunc={approveFlag ? ListGas : ApproveGas}
                />
            )}
        </>
    );
}
