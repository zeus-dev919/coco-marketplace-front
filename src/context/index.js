import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
} from "react";
import { ethers } from "ethers";
import { useWallet } from "use-wallet";
import { useQuery } from "@apollo/client";
import { NotificationManager } from "react-notifications";

import { testToken, getNFTContract, marketplaceContract } from "../contracts";
import { fromBigNum, toBigNum } from "../utils";
import {
    GET_ALLNFTS,
    GET_USERDATA,
    GET_USERSINFO,
    GET_COLLECTIONNFTS,
} from "../components/gql";
import addresses from "../contracts/contracts/addresses.json";

const BlockchainContext = createContext();

export function useBlockchainContext() {
    return useContext(BlockchainContext);
}

function reducer(state, { type, payload }) {
    return {
        ...state,
        [type]: payload,
    };
}

const INIT_STATE = {
    allNFT: [],
    collectionNFT: [],
    signer: {},
    provider: {},
    userInfo: {},
    usersInfo: {},
    balance: 0,
    addresses: addresses,
    auth:{
        isAuth:false
    }
};

export default function Provider({ children }) {
    const wallet = useWallet();
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    const {
        data: nftsData,
        loading: nftsLoading,
        error: nftsError,
    } = useQuery(GET_ALLNFTS, {
        pollInterval: 500,
    });

    const {
        data: nftsCollectionData,
        loading: nftsCollectionLoading,
        error: nftsCollectionError,
    } = useQuery(GET_COLLECTIONNFTS, {
        pollInterval: 500,
    });

    const {
        data: userData,
        loading: userDataLoading,
        error: userDataError,
    } = useQuery(GET_USERDATA, {
        variables: {
            account: wallet.account,
        },
        pollInterval: 500,
    });

    const {
        data: usersData,
        loading: usersLoading,
        error: usersError,
    } = useQuery(GET_USERSINFO, {
        pollInterval: 500,
    });

    useEffect(() => {
        if (nftsLoading||nftsError) {
            return;
        }
        dispatch({
            type: "allNFT",
            payload: nftsData.getAllNFTs,
        });
    }, [nftsData]);

    useEffect(() => {
        if (nftsCollectionLoading||nftsCollectionError) {
            return;
        }
        dispatch({
            type: "collectionNFT",
            payload: nftsCollectionData.getCollectionNFTs,
        });
    }, [nftsCollectionData]);

    useEffect(() => {
        if (userDataLoading||userDataError) {
            return;
        }

        if (wallet.status === "connected") {
            dispatch({
                type: "userInfo",
                payload: userData.getUserInfo,
            });
        } else {
            dispatch({
                type: "userInfo",
                payload: {},
            });
        }
    }, [userData, userDataLoading, wallet.status]);

    useEffect(() => {
        if (usersLoading||usersError) {
            return;
        }
        let bump = {};
        for (let i = 0; i < usersData.getUsersInfo.length; i++) {
            bump = {
                ...bump,
                [usersData.getUsersInfo[i].address]: usersData.getUsersInfo[i],
            };
        }
        dispatch({
            type: "usersInfo",
            payload: bump,
        });
    }, [usersData, usersLoading]);

    /* ------------ Wallet Section ------------- */

    useEffect(() => {
        const getSigner = async () => {
            if (wallet.status === "error") {
                NotificationManager.error("connect Fantom Testnet");
            }

            if (wallet.status === "connected") {
                NotificationManager.success("Welcome back");
                const provider = new ethers.providers.Web3Provider(
                    wallet.ethereum
                );
                const signer = provider.getSigner();
                dispatch({
                    type: "signer",
                    payload: signer,
                });

                dispatch({
                    type: "provider",
                    payload: provider,
                });
            } else {
                dispatch({
                    type: "userInfo",
                    payload: {},
                });
            }
        };

        getSigner();
    }, [wallet.status]);

    /* ------------ NFT Section ------------- */
    // coin check
    const checkBalance = async () => {
        try {
            if (wallet.status === "connected") {
                const balance = await testToken.balanceOf(wallet.account);
                return fromBigNum(balance, 18);
            } else {
                return 0;
            }
        } catch (err) {
            console.log("checkBalance error: ", err.message);
            return 0;
        }
    };

    // NFT manage
    const mintNFT = async (url) => {
        try {
            const NFTContract1 = getNFTContract(addresses.NFT.NFT1);

            const signedNFTContract1 = NFTContract1.connect(state.signer);
            const tx = await signedNFTContract1.mint(url);
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    // NFT on sale
    const onsaleNFT = async (props) => {
        try {
            const { nftAddress, assetId, price, expiresAt } = props;

            const NFTContract = getNFTContract(nftAddress);
            const signedNFTContract1 = NFTContract.connect(state.signer);
            const tx = await signedNFTContract1.approve(
                addresses.Marketplace,
                toBigNum(assetId, 0)
            );
            await tx.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.signer
            );
            const tx1 = await signedMarketplaceContract.createOrder(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                expiresAt
            );
            await tx1.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const cancelOrder = async (props) => {
        try {
            const { nftAddress, assetId } = props;

            const signedMarketplaceContract = marketplaceContract.connect(
                state.signer
            );
            const tx = await signedMarketplaceContract.cancelOrder(
                nftAddress,
                assetId
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    // NFT buy and bid
    const buyNFT = async (props) => {
        try {
            const { nftAddress, assetId, price } = props;

            const signedTokenContract = testToken.connect(state.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.signer
            );
            const tx = await signedMarketplaceContract.Buy(
                nftAddress,
                assetId,
                toBigNum(price, 18)
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const bidNFT = async (props) => {
        try {
            const { nftAddress, assetId, price, expiresAt } = props;

            const signedTokenContract = testToken.connect(state.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.signer
            );
            const tx = await signedMarketplaceContract.PlaceBid(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                expiresAt
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const bidApprove = async (props) => {
        try {
            const { address, id, price } = props;

            const signedMarketplaceContract = marketplaceContract.connect(
                state.signer
            );
            const tx = await signedMarketplaceContract.acceptBid(
                address,
                id,
                toBigNum(price, 18)
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        checkBalance,
                        mintNFT,
                        onsaleNFT,
                        cancelOrder,
                        buyNFT,
                        bidNFT,
                        bidApprove,
                    },
                ],
                [state]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
