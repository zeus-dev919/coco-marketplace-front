import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import QRCode from "qrcode.react";
import { useBlockchainContext } from "../../context";
import { copyToClipboard } from "../../utils";
import styled from "styled-components";
import TokenCard from "./tokenCard";
import Action from "../../service";

const Card = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

export default function Wallet() {
    const [state, { translateLang, CoinTransfer }] = useBlockchainContext();
    const [showSend, setShowSend] = useState(false);
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [selectedCoin, setSelectCoin] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCredit, setShowCredit] = useState(false);
    const [creditAmount, setCreditAmount] = useState(0);

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
        const result = await Action.buy_credit({
            buyAmount: creditAmount,
        });

        if (result) {
            NotificationManager.success("Successfully Buy");
            setShowCredit(false);
        } else {
            NotificationManager.error("Failed Buy");
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
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Please enter amount"
                                    value={creditAmount}
                                    onChange={(e) =>
                                        setCreditAmount(e.target.value)
                                    }
                                />
                                <dis className="spacer-single"></dis>
                                <p className="centered">
                                    Total Budget: 1023.34$
                                </p>
                                <dis className="spacer-single"></dis>
                                <div className="attribute">
                                    <button
                                        className="btn-main"
                                        onClick={() => setShowCredit(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-main"
                                        onClick={HandleCredit}
                                    >
                                        Buy
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
