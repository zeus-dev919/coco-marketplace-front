import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import QRCode from "qrcode.react";
import { useBlockchainContext } from "../../context";
import { copyToClipboard } from "../../utils";
import styled from "styled-components";
import scriptLoader from "react-async-script-loader";
import TokenCard from "./tokenCard";
import Action from "../../service";

const Card = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

const Wallet = ({ isScriptLoaded, isScriptLoadSucceed }) => {
    const [state, { translateLang, CoinTransfer }] = useBlockchainContext();
    const [showSend, setShowSend] = useState(false);
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [selectedCoin, setSelectCoin] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCredit, setShowCredit] = useState(false);
    const [creditAmount, setCreditAmount] = useState(0);
    const [stripe, setStripe] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        (async () => {
            var res = await Action.getRequests();
            setRequests(res.data);
        })();
    }, []);

    useEffect(() => {
        if (isScriptLoaded && isScriptLoadSucceed) {
            setStripe(
                window.Stripe(
                    "pk_test_51LSOMUAWSmSN13IcFbFAuHzeHEP2XUGZGxN4juEiaK9R0neGILKvY1Bd8KUGeKgZOvRk3BK0aMBuDm56C6cnGRZE00JfRMtX7M"
                )
            );
        }
    }, [isScriptLoaded, isScriptLoadSucceed]);

    const handleaddressCopy = () => {
        copyToClipboard(state.auth.address)
            .then((res) => {
                NotificationManager.success(
                    translateLang("addresscopy_success")
                );
            })
            .catch((err) => {
                console.log(err);
                NotificationManager.error(translateLang("operation_error"));
            });
    };

    const HandleTokenClick = (item) => {
        setShowSend(true);
        setSelectCoin(item.label);
    };

    const HandleSend = async () => {
        if (toAddress === "") {
            NotificationManager.error("please input send address");
            return;
        }
        if (amount <= 0) {
            NotificationManager.error("please input amount");
            return;
        }
        setLoading(true);
        const result = await CoinTransfer({
            coinType: selectedCoin,
            toAddress: toAddress,
            amount: amount,
        });
        if (result) {
            NotificationManager.success("Successfully sending");
            setShowSend(false);
            setToAddress("");
            setAmount(0);
            setLoading(false);
        } else {
            NotificationManager.error("Failed sending");
            setLoading(false);
        }
    };

    const HandleCredit = async () => {
        try {
            setLoading(true);
            if (creditAmount > 1) {
                NotificationManager.warning("Amount must be less than 1");
                setLoading(false);
                return;
            }

            const session = await Action.buy_credit({
                buyAmount: creditAmount,
            });

            const result = await stripe.redirectToCheckout({
                sessionId: session.data.id,
            });

            if (result) {
                NotificationManager.success("Successfully Buy");
                setShowCredit(false);
                setLoading(false);
            } else {
                NotificationManager.error("Failed Buy");
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-lg-5 col-md-6 col-sm-6 col-xs-12">
                {showSend ? (
                    <div className="field-set sendmoney">
                        <span>
                            <p>From: </p>
                            <input
                                type="text"
                                className="form-control"
                                value={state.auth.address}
                                disabled
                            />
                        </span>
                        <div className="spacer-10"></div>
                        <span>
                            <p>To: </p>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="fill out address"
                                onChange={(e) => setToAddress(e.target.value)}
                                value={toAddress}
                            />
                        </span>
                        <div className="spacer-10"></div>
                        <span>
                            <p>Amount: </p>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="input send amount"
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                            />
                        </span>

                        <div className="spacer-20"></div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="button"
                                className="btn-main"
                                value={translateLang("btn_cancel")}
                                onClick={() => setShowSend(false)}
                            />
                            {loading ? (
                                <button className="btn-main">
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            ) : (
                                <input
                                    type="button"
                                    className="btn-main"
                                    value={"Send"}
                                    onClick={HandleSend}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="field-set">
                        <div
                            className="text_copy noselect"
                            style={{ color: "grey", textAlign: "left" }}
                            onClick={handleaddressCopy}
                        >
                            <span>{state.auth.address}</span>
                            <span style={{ padding: "0 10px" }}>
                                <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                            </span>
                        </div>
                        <div className="spacer-20"></div>
                        {!showCredit ? (
                            <>
                                <span className="centered sell_preview">
                                    <QRCode
                                        value={state.auth.address}
                                        size={250}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                    <button
                                        className="btn-main"
                                        onClick={() => setShowCredit(true)}
                                    >
                                        Credit
                                    </button>
                                </span>
                                <div className="spacer-20"></div>
                                <h5>{translateLang("mybalance")}</h5>
                                <Card>
                                    {state.currencies.map((item, index) => (
                                        <div
                                            onClick={() =>
                                                HandleTokenClick(item)
                                            }
                                            key={index}
                                        >
                                            <TokenCard
                                                key={index}
                                                balance={Number(
                                                    state.balances[index]
                                                ).toFixed(2)}
                                                label={item.label}
                                            />
                                        </div>
                                    ))}
                                </Card>
                                <div className="spacer-20"></div>
                            </>
                        ) : (
                            <>
                                <div className="credit__set">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Please enter amount"
                                        value={creditAmount}
                                        onChange={(e) =>
                                            setCreditAmount(e.target.value)
                                        }
                                    />
                                    <div>Max: 1 ETH</div>
                                </div>
                                <div className="spacer-single"></div>
                                <p className="centered">
                                    Checkout:{" "}
                                    {creditAmount * state.prices.ETHJPYPrice}¥
                                </p>
                                <div className="spacer-single"></div>
                                <div className="attribute">
                                    <button
                                        className="btn-main"
                                        onClick={() => setShowCredit(false)}
                                    >
                                        Cancel
                                    </button>
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
                                            onClick={HandleCredit}
                                        >
                                            Buy
                                        </button>
                                    )}
                                </div>
                                <div className="spacer-half"></div>
                                <div className="requests">
                                    {requests?.map((item, index) => (
                                        <span key={index}>
                                            <p>
                                                {Number(item.amount).toFixed(2)}{" "}
                                                ETH
                                            </p>
                                            <p>
                                                {Number(
                                                    item.amount * item.price
                                                ).toFixed(2)}
                                            </p>
                                            <p className="color">
                                                {item.status}
                                            </p>
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default scriptLoader("https://js.stripe.com/v3/")(Wallet);
