import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import moment from "moment";

export default function BuyModal(props) {
    const { buyFlag, show, setShow, correctItem } = props;
    const [
        state,
        {
            buyNFT,
            bidNFT,
            getCurrency,
            translateLang,
            NFTTransfer,
            buyNFTGas,
            bidNFTGas,
            NFTTransferGas,
        },
    ] = useBlockchainContext();
    const [price, setPrice] = useState(0);
    const [currency, setCurrency] = useState("ETH");
    const [date, setDate] = useState(new Date());
    const [sendAddress, setSendAddress] = useState("");
    const [bidBtnFlag, setBidBtnFlag] = useState(true);
    const [buyBtnFlag, setBuyBtnFlag] = useState(true);
    const [loading, setLoading] = useState(false);
    const [gasFee, setGasFee] = useState(0);

    useEffect(() => {
        (async () => {
            let gas = 0;
            switch (buyFlag) {
                case 1:
                    gas = await HandleBuyGas();
                    break;
                case 2:
                    gas = await HandleBidGas();
                    break;
                case 3:
                    gas = await HandleTransferGas();
                    break;
                default:
                    break;
            }

            setGasFee(((state.gasPrice * gas) / 10 ** 9).toFixed(10));
        })();

        const initialDate = new Date();
        initialDate.setDate(initialDate.getDate() + 10);
        setDate(initialDate);
    }, [buyFlag]);

    useEffect(() => {
        const b = async () => {
            let accpetedCurrency = getCurrency(
                correctItem.marketdata?.acceptedToken
            );
            setCurrency(accpetedCurrency.label);
        };
        b();
    }, [state.auth, correctItem]);

    useEffect(() => {
        if (correctItem) {
            if (
                state.balances[0] > price &&
                price > 0 &&
                moment(date).isValid()
            ) {
                setBidBtnFlag(false);
            } else {
                setBidBtnFlag(true);
            }

            if (state.balances[0] > Number(correctItem.marketdata.price)) {
                setBuyBtnFlag(false);
            } else {
                setBuyBtnFlag(true);
            }
        }
    }, [state, date, price]);

    const handle = (newDate) => {
        setDate(newDate);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(state.auth.address);
        NotificationManager.success(translateLang("addresscopy_success"));
    };

    const handleBuy = async () => {
        try {
            setLoading(true);
            if (state.balances[0] < Number(correctItem?.marketdata.price)) {
                return;
            }

            await buyNFT({
                nftAddress: correctItem?.collectionAddress,
                assetId: correctItem?.tokenID,
                price: correctItem?.marketdata.price,
                acceptedToken: correctItem?.marketdata.acceptedToken,
            });
            NotificationManager.success(translateLang("buynft_success"));
            setLoading(false);
            setShow(false);
        } catch (err) {
            console.log(err.message);
            NotificationManager.error(translateLang("buynft_error"));
            setLoading(false);
        }
    };

    const HandleBuyGas = async () => {
        let gas = await buyNFTGas({
            nftAddress: correctItem?.collectionAddress,
            assetId: correctItem?.tokenID,
            price: correctItem?.marketdata.price,
        });
        return gas;
    };

    const handleBid = async () => {
        try {
            if (!moment(date).isValid()) {
                return;
            }
            if (price < Number(correctItem?.marketdata.bidPrice)) {
                NotificationManager.warning(translateLang("increasebid_warn"));
                return;
            }

            setLoading(true);
            await bidNFT({
                nftAddress: correctItem?.collectionAddress,
                assetId: correctItem?.tokenID,
                price: price,
                acceptedToken: correctItem?.marketdata.acceptedToken,
                expiresAt: moment(date).valueOf(),
            });
            NotificationManager.success(translateLang("bid_success"));
            setLoading(false);
            setShow(false);
        } catch (err) {
            console.log(err.message);
            NotificationManager.error(translateLang("bid_error"));
            setLoading(false);
        }
    };

    const HandleBidGas = async () => {
        let gas = await bidNFTGas({
            nftAddress: correctItem?.collectionAddress,
            assetId: correctItem?.tokenID,
            price: 1,
            expiresAt: moment(date).valueOf(),
        });
        return gas;
    };

    const HandleTransfer = async () => {
        if (sendAddress.trim() === "") {
            NotificationManager.error("Please enter sending address");
            return;
        }

        setLoading(true);
        let result = await NFTTransfer({
            id: correctItem?.tokenID,
            toAddress: sendAddress,
            collectionAddress: correctItem?.collectionAddress,
        });

        if (result) {
            NotificationManager.success("Successfully Transfer");
            setLoading(false);
            setShow(false);
        } else {
            NotificationManager.error("Failed Transfer");
            setLoading(false);
        }
    };

    const HandleTransferGas = async () => {
        let gas = await NFTTransferGas({
            id: correctItem?.tokenID,
            toAddress: "0x1111111111111111111111111111111111111111",
            collectionAddress: correctItem?.collectionAddress,
        });
        return gas;
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => setShow(false)}
            contentClassName="add-modal-content"
            centered
        >
            {buyFlag === 1 ? (
                <>
                    <Modal.Header>
                        <Modal.Title>
                            {translateLang("buyingnft_title")}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <h4 className="text-center">
                            {translateLang("youneed")}{" "}
                            {correctItem?.marketdata.price} {currency} +{" "}
                            <b>{gasFee}</b> {currency}
                        </h4>
                        <span className="spacer-10"></span>
                        <p className="text-center">
                            Buy any NFT with {currency} token. It can take up to
                            a minute for your balance update.
                        </p>
                        <span className="spacer-single"></span>
                        <div>
                            <span style={{ justifyContent: "space-between" }}>
                                <h5>{translateLang("walletaddress")}</h5>
                                <p>
                                    {translateLang("mybalance")}:{" "}
                                    {state.balances[1]} {currency}
                                </p>
                                <p>
                                    {translateLang("mybalance")}:{" "}
                                    {state.balances[0]} ETH
                                </p>
                            </span>
                            <div
                                className="text_copy noselect"
                                style={{ color: "grey", textAlign: "left" }}
                                onClick={handleCopy}
                            >
                                <span>{state.auth.address}</span>
                                <span style={{ padding: "0 10px" }}>
                                    <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                                </span>
                            </div>
                        </div>
                        <div className="spacer-20"></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
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
                                onClick={handleBuy}
                                disabled={buyBtnFlag}
                            >
                                {translateLang("checkout")}
                            </button>
                        )}
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            ) : buyFlag === 2 ? (
                <>
                    <Modal.Header>
                        <Modal.Title>
                            {translateLang("btn_makeoffer")}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <h4 className="text-center">
                            {translateLang("youneed")} {price} {currency} +{" "}
                            <b>{gasFee}</b> {currency}
                        </h4>
                        <p className="text-center">
                            {translateLang("bidnote")}
                        </p>
                        <h5>{translateLang("sellprice")}</h5>
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
                                <span>{currency}</span>
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
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <p style={{ float: "right" }}>
                            {"Available Price: "}
                            {state.balances[0] + " " + currency}
                        </p>
                        <div className="spacer-30"></div>

                        <h5>{translateLang("offerexpiration")}</h5>
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
                        <div className="spacer-20"></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
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
                                onClick={handleBid}
                                disabled={bidBtnFlag}
                            >
                                {translateLang("btn_makeoffer")}
                            </button>
                        )}
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            ) : (
                <>
                    <Modal.Header>
                        <Modal.Title>{"NFT Transfer"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <h4 className="text-center">
                            {"You need "}{" "}
                            <b style={{ color: "#111" }}>{gasFee}</b> {" ETH"}
                        </h4>
                        <p>{"Sending Address: "}</p>
                        <div className="price">
                            <input
                                type="text"
                                className="form-control"
                                style={{
                                    flex: "4 4 0",
                                }}
                                value={sendAddress}
                                onChange={(e) => setSendAddress(e.target.value)}
                            />
                        </div>

                        <div className="spacer-single"></div>
                        <div className="m-10-hor" style={{ padding: "0 30px" }}>
                            <h5 className="jumbomain">Your ETH wallet:</h5>
                            <h5 className="jumbomain">
                                Balance:{" "}
                                <b>{Number(state.balances[0]).toFixed(4)}</b>
                            </h5>
                            <Link to="/author?path=wallet">
                                <button className="btn-main">Add funds</button>
                            </Link>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
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
                                onClick={HandleTransfer}
                            >
                                {"Transfer"}
                            </button>
                        )}
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
}
