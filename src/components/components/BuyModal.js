import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { Modal } from "react-bootstrap";
import DateTimeField from "@1stquad/react-bootstrap-datetimepicker";
import { NotificationManager } from "react-notifications";
import { useBlockchainContext } from "../../context";
import moment from "moment";

export default function BuyModal(props) {
    const { buyFlag, show, setShow, correctItem } = props;
    const [state, { checkBalance, buyNFT, bidNFT }] = useBlockchainContext();
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date());
    const [mybalance, setMybalance] = useState(0);
    const [bidBtnFlag, setBidBtnFlag] = useState(true);
    const [buyBtnFlag, setBuyBtnFlag] = useState(true);

    useEffect(() => {
        const b = async () => {
            let result = await checkBalance();
            setMybalance(result);
        };

        b();

        if (
            mybalance > Number(correctItem.marketdata.price) &&
            price > 0 &&
            price !== "" &&
            moment(date).isValid()
        ) {
            setBidBtnFlag(false);
        } else {
            setBidBtnFlag(true);
        }

        if (mybalance > Number(correctItem.marketdata.price)) {
            setBuyBtnFlag(false);
        } else {
            setBuyBtnFlag(true);
        }
    }, [mybalance, date, price]);

    const handle = (newDate) => {
        setDate(newDate);
    };

    const handleCopy = () => {
        navigator.clipboard.write(state.userInfo.address);
        NotificationManager.success("address copied");
    };

    const buyHandle = () => {
        if (mybalance < Number(correctItem.marketdata.price)) {
            return;
        }

        buyNFT({
            nftAddress: correctItem.collectionAddress,
            assetId: correctItem.tokenID,
            price: correctItem.marketdata.price,
        })
            .then((res) => {
                if (res) NotificationManager.success("Successfully Buy NFT");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const bidHandle = () => {
        if (
            mybalance < Number(correctItem.marketdata.price) ||
            mybalance < Number(correctItem.marketdata.bidPrice)
        ) {
            return;
        }
        if (!moment(date).isValid()) {
            return;
        }
        if (mybalance < Number(correctItem.marketdata.bidPrice)) {
            NotificationManager.error("Please increase bid price");
            return;
        }

        bidNFT({
            nftAddress: correctItem.collectionAddress,
            assetId: correctItem.tokenID,
            price: price,
            expiresAt: moment(date).valueOf(),
        })
            .then((res) => {
                if (res) NotificationManager.success("Successfully Bid NFT");
            })
            .catch((err) => {
                console.log(err);
            });
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
                        <Modal.Title>Buying NFT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <h4 className="text-center">
                            You need {correctItem.marketdata.price} Crypto-Coco +{" "}
                            <Link to="">gas fees</Link>
                        </h4>
                        <span className="spacer-10"></span>
                        <p className="text-center">
                            Buy any NFT with Crypto-Coco token. It can take up to a
                            minute for your balance update.
                        </p>
                        <span className="spacer-single"></span>
                        <div>
                            <span style={{ justifyContent: "space-between" }}>
                                <h5>Wallet Address</h5>
                                <p>Balance: {mybalance} Crypto-Coco</p>
                            </span>
                            <div
                                className="text_copy noselect"
                                style={{ color: "grey", textAlign: "left" }}
                                onClick={handleCopy}
                            >
                                <span>{state.userInfo.address}</span>
                                <span style={{ padding: "0 10px" }}>
                                    <i className="bg-color-2 i-boxed icon_pencil-edit"></i>
                                </span>
                            </div>
                        </div>
                        <div className="spacer-20"></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="spacer-10"></div>
                        <button
                            className="btn-main"
                            onClick={buyHandle}
                            disabled={buyBtnFlag}
                        >
                            Checkout
                        </button>
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            ) : (
                <>
                    <Modal.Header>
                        <Modal.Title>Make an offer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="spacer-single"></span>
                        <p className="text-center">
                            To be recommended, it must be higher than the
                            previous bid price.
                        </p>
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
                                <span>Crypto-Coco</span>
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
                            {mybalance + " Crypto-Coco"}
                        </p>
                        <div className="spacer-30"></div>

                        <h5>Offer Expiration</h5>
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
                        <button
                            className="btn-main"
                            onClick={bidHandle}
                            disabled={bidBtnFlag}
                        >
                            Make Offer
                        </button>
                        <div className="spacer-10"></div>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
}
