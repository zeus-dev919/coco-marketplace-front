import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockchainContext } from "../../context";
import Action from "../../service";
import BuyModal from "./BuyModal";
import { fromBigNum } from "../../utils";

export default function NFTLists() {
    const navigate = useNavigate();
    const [height, setHeight] = useState(0);
    const [state, { getCurrency, translateLang }] = useBlockchainContext();
    const [filter, setFilter] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const onImgLoad = (e) => {
        let currentHeight = height;
        if (currentHeight < e.target.offsetHeight) {
            setHeight(e.target.offsetHeight);
        }
    };

    const handleItem = (e, param, item) => {
        var buyButton = document.getElementById("buy" + param);
        var likeButton = document.getElementById("like" + param);

        if (buyButton) {
            var isClickBuyButton = buyButton.contains(e.target);
        }
        var isClickLikeButton = likeButton.contains(e.target);

        if (isClickBuyButton) {
            setCurrentItem(item);
            setModalShow(true);
        } else if (isClickLikeButton) {
            if (state.userInfo.address === undefined) {
                navigate("/signPage");
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
            if (state.userInfo.address === undefined) {
                navigate("/signPage");
                return;
            }
            navigate(`/ItemDetail/${item.collectionAddress}/${item.tokenID}`);
            return;
        }
    };

    const NFTs = useMemo(() => {
        if (!filter)
            return state.allNFT;
        else {
            return state.allNFT.filter(
                (item) =>
                    item.owner.toLowerCase() ==
                    state.addresses.Marketplace.toLowerCase()
            );
        }
    }, [state.allNFT, filter]);

    return (
        <div className="row">
            {NFTs.map((nft, index) => (
                <div
                    key={index}
                    className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4"
                    onClick={(e) => handleItem(e, index, nft)}
                >
                    <div className="nft__item m-0">
                        <div className="author_list_pp">
                            <span>
                                <img
                                    className="lazy"
                                    src={
                                        // state.usersInfo[nft.owner]?.image ===
                                        //     undefined
                                        //     ? state.collectionNFT[0]?.metadata
                                        //         .image
                                        //     : state.usersInfo[nft.owner]
                                        //         .image ||
                                        "./img/author/author-1.jpg"
                                    }
                                    alt=""
                                />
                                <i className="fa fa-check"></i>
                            </span>
                        </div>
                        <div
                            className="nft__item_wrap"
                            style={{ height: `${height}px` }}
                        >
                            <span>
                                <img
                                    onLoad={(e) => onImgLoad(e)}
                                    src={
                                        nft.metadata.image ||
                                        "./img/collections/coll-item-3.jpg"
                                    }
                                    className="lazy nft__item_preview"
                                    alt=""
                                />
                            </span>
                        </div>
                        <div className="nft__item_info">
                            <span>
                                <h4>{nft.metadata.name}</h4>
                            </span>
                            <div className="nft__item_price">
                                {nft.marketdata.price === ""
                                    ? null
                                    : nft.marketdata.price +
                                      getCurrency(nft.marketdata.acceptedToken)
                                          ?.label}
                                <span>
                                    {nft.marketdata.bidders.length}{" "}
                                    {translateLang("bid")}
                                </span>
                            </div>
                            <div className="nft__item_action">
                                {nft.marketdata.price === "" ? null : (
                                    <span id={"buy" + index}>
                                        {translateLang("buynow")}
                                    </span>
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

            <div className="spacer-30"></div>

            {currentItem !== null ? (
                <BuyModal
                    buyFlag={1}
                    show={modalShow}
                    setShow={setModalShow}
                    correctItem={currentItem}
                />
            ) : null}
            {/* <ul className="pagination">
                <li>
                    <span className="a">Prev</span>
                </li>
                <li className="active">
                    <span className="a">1</span>
                </li>
                <li>
                    <span className="a">2</span>
                </li>
                <li>
                    <span className="a">3</span>
                </li>
                <li>
                    <span className="a">4</span>
                </li>
                <li>
                    <span className="a">5</span>
                </li>
                <li>
                    <span className="a">Next</span>
                </li>
            </ul> */}
        </div>
    );
}
