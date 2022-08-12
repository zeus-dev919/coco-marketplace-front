import React, { useMemo, useState } from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useBlockchainContext } from "../../context";
import Action from "../../service";

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

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

export default function ColumnOne(props) {
    const navigate = useNavigate();
    const { correctItem } = props;
    const [state, { getCurrency }] = useBlockchainContext();
    const [height, setHeight] = useState(0);
    const [filter, setFilter] = useState(null);

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
                    item.owner.toLowerCase() !==
                    state.addresses.Marketplace.toLowerCase()
            );
        else {
            return correctItem.items.filter(
                (item) =>
                    item.owner.toLowerCase() !==
                    state.addresses.Marketplace.toLowerCase()
            );
        }
    }, [correctItem, filter]);

    const handleItem = (e, param, item) => {
        var likeButton = document.getElementById("like" + param);
        var isClickLikeButton = likeButton.contains(e.target);

        if (isClickLikeButton) {
            if (state.auth.address === undefined) {
                navigate("/signPage");
                return;
            }
            Action.nft_like({
                collectAddress: item.collectionAddress,
                tokenId: item.tokenID,
                currentAddress: state.auth.address,
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
            delay={800}
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
                                        : nft.marketdata.price + " " + getCurrency(nft.marketdata?.acceptedToken)?.label}
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
                                    style={{ color: "#c5a86a" }}
                                >
                                    <i className="fa fa-heart"></i>
                                    <span>{nft.likes.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Reveal>
    );
}
