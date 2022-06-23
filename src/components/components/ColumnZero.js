import React, { useMemo, useState } from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import styled from "styled-components";
import { useNavigate } from "@reach/router";
import { useBlockchainContext } from "../../context";
import Action from "../../service";
import BuyModal from "./BuyModal";

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

export default function ColumnZero(props) {
    const navigate = useNavigate();
    const { correctItem } = props;
    const [state, { }] = useBlockchainContext();
    const [height, setHeight] = useState(0);
    const [filter, setFilter] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const onImgLoad = (e) => {
        let currentHeight = height;
        if (currentHeight < e.target.offsetHeight) {
            setHeight(e.target.offsetHeight);
        }
    };

    const NFTs = useMemo(() => {
        if (!filter)
            return correctItem.items.filter(
                (item) =>
                    item.owner.toLowerCase() ===
                    state.addresses.Marketplace.toLowerCase()
            );
        else {
            return correctItem.items.filter(
                (item) =>
                    item.owner.toLowerCase() ===
                    state.addresses.Marketplace.toLowerCase()
            );
        }
    }, [correctItem, filter]);

    const handleItem = (e, param, item) => {
        var buyButton = document.getElementById("buy" + param);
        var likeButton = document.getElementById("like" + param);

        if (buyButton) {
            var isClickBuyButton = buyButton.contains(e.target);
        }
        var isClickLikeButton = likeButton.contains(e.target);

        if (isClickBuyButton) {
            if (state.userInfo.address === undefined) {
                navigate("/wallet");
                return;
            }
            setCurrentItem(item);
            setModalShow(true);
        } else if (isClickLikeButton) {
            if (state.userInfo.address === undefined) {
                navigate("/wallet");
                return;
            }
            Action.nft_like({
                collectAddress: item.collectionAddress,
                tokenId: item.tokenID,
                currentAddress: state.userInfo.address,
            })
                .then((res) => {
                    if (res) {
                        console.log(res);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            return;
        } else {
            navigate(`/ItemDetail/${item.collectionAddress}/${item.tokenID}`);
            return;
        }
    };

    return (
        <Reveal
            className="onStep"
            keyframes={fadeInUp}
            delay={300}
            duration={600}
        >
            <div className="row">
                {NFTs.map((nft, index) => (
                    <div
                        key={index}
                        className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                        onClick={(e) => handleItem(e, index, nft)}
                    >
                        <div className="nft__item">
                            <div
                                className="nft__item_wrap"
                                style={{ height: `${height}px` }}
                            >
                                <Outer>
                                    <span>
                                        <img
                                            onLoad={(e) => onImgLoad(e)}
                                            src={nft.metadata.image}
                                            className="lazy nft__item_preview"
                                            alt=""
                                        />
                                    </span>
                                </Outer>
                            </div>
                            <div className="nft__item_info">
                                <span>
                                    <h4>{nft.metadata.name}</h4>
                                </span>
                                <div className="nft__item_price">
                                    {nft.marketdata.price === ""
                                        ? null
                                        : nft.marketdata.price + " Crypto-Coco"}
                                    <span>
                                        {nft.marketdata.bidders.length} bids
                                    </span>
                                </div>
                                <div className="nft__item_action">
                                    {nft.marketdata.price === "" ? null : (
                                        <span id={"buy" + index}>Buy Now</span>
                                    )}
                                </div>
                                <div
                                    className="nft__item_like"
                                    id={"like" + index}
                                    style={
                                        nft.likes.indexOf(
                                            state.userInfo.address
                                        ) === -1
                                            ? null
                                            : { color: "#c5a86a" }
                                    }
                                >
                                    <i className="fa fa-heart"></i>
                                    <span>{nft.likes.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {currentItem !== null ? (
                    <BuyModal
                        buyFlag={1}
                        show={modalShow}
                        setShow={setModalShow}
                        correctItem={currentItem}
                    />
                ) : null}
            </div>
        </Reveal>
    );
}
