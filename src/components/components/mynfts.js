import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useBlockchainContext } from "../../context";

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

export default function Responsive() {
    const navigate = useNavigate();
    const [state, {}] = useBlockchainContext();
    const [height, setHeight] = useState(0);
    const [mynfts, setMyNfts] = useState(null);

    useEffect(() => {
        if (state.allNFT !== []) {
            let bump = [];
            state.allNFT.map((item) => {
                if (
                    item.owner === state.userInfo.address ||
                    item.marketdata.owner === state.userInfo.address
                ) {
                    bump.push(item);
                }
            });
            setMyNfts(bump);
        }
    }, [state.allNFT]);

    const handleItem = (item) => {
        navigate(`/ItemDetail/${item.collectionAddress}/${item.tokenID}`);
    };

    const onImgLoad = (e) => {
        let currentHeight = height;
        if (currentHeight < e.target.offsetHeight) {
            setHeight(e.target.offsetHeight);
        }
    };

    return (
        <div className="row">
            {mynfts !== null
                ? mynfts.map((nft, index) => (
                      <div
                          key={index}
                          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                          onClick={() => handleItem(nft)}
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
                                  {/* <div className="nft__item_price">
                                      {10} ETH
                                      <span>
                                          {nft.marketdata.bidders.length}
                                      </span>
                                  </div>
                                  <div className="nft__item_action">
                                      <span>Place a bid</span>
                                  </div> */}
                                  <div
                                      className="nft__item_like"
                                      style={{ color: "#c5a86a" }}
                                  >
                                      <i className="fa fa-heart"></i>
                                      <span>{nft.likes.length}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))
                : "No Data..."}
        </div>
    );
}
