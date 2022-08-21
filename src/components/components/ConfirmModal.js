import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useBlockchainContext } from "../../context";

export default function ConfirmModal(props) {
    const { actionFunc, show, setShow, estimateFunc } = props;
    const [gasFee, setGasFee] = useState(0);
    const [state, {}] = useBlockchainContext();

    useEffect(() => {
        (async () => {
            let gas = await estimateFunc();
            setGasFee(((state.gasPrice * gas) / 10 ** 9).toFixed(10));
        })();
    }, [estimateFunc]);

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => setShow(false)}
            contentClassName="add-modal-content"
            centered
        >
            <Modal.Header>
                <Modal.Title>{"Funds to purchase"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className="spacer-single"></span>
                <h4 className="text-center">
                    {"You need "} <b style={{ color: "#111" }}>{gasFee}</b>{" "}
                    {" ETH"}
                </h4>
                <div className="spacer-half"></div>
                <p className="text-center">
                    Transfer funds to your wallet or add funds with a card. It
                    can take up to a minute for your balance to update.
                </p>
                <div className="spacer-single"></div>
                <div className="m-10-hor" style={{ padding: "0 30px" }}>
                    <h5 className="jumbomain">Your ETH wallet:</h5>
                    <h5 className="jumbomain">
                        Balance: <b>{Number(state.balances[0]).toFixed(4)}</b>
                    </h5>
                    <Link to="/author?path=wallet">
                        <button className="btn-main">Add funds</button>
                    </Link>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="spacer-10"></div>
                <button className="btn-main" onClick={actionFunc}>
                    {"Confirm Action"}
                </button>
                <div className="spacer-10"></div>
            </Modal.Footer>
        </Modal>
    );
}
