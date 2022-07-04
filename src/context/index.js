import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
} from "react";
import { ethers } from "ethers";
import { useQuery } from "@apollo/client";
import { NotificationManager } from "react-notifications";
import decode from "jwt-decode";
import axios from "axios";

import { testToken, getNFTContract, marketplaceContract, provider } from "../contracts";
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

const Currency = [
    {
        label: "BNB",
        value: "0xC7Fa266c7E1C6849a805044c046b85C5ED89E46F",
    },
    {
        label: "BUSD",
        value: "0x628d77121aB538b1E094e0367D4A49A945d57F6f",
    },
]

const INIT_STATE = {
    allNFT: [],
    collectionNFT: [],
    provider: provider,
    userInfo: {},
    usersInfo: {},
    balance: 0,
    addresses: addresses,
    auth: {
        isAuth: false,
        user: "",
        address: "",
        signer: {},
        privateKey: ""
    },
    currencies: Currency
};


export default function Provider({ children }) {
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
            account: state.auth.address,
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
        console.log(nftsLoading, nftsError);
        if (nftsLoading || nftsError) {
            return;
        }
        dispatch({
            type: "allNFT",
            payload: nftsData.getAllNFTs,
        });
    }, [nftsData, nftsLoading, nftsError]);

    useEffect(() => {
        if (nftsCollectionLoading || nftsCollectionError) {
            return;
        }
        dispatch({
            type: "collectionNFT",
            payload: nftsCollectionData.getCollectionNFTs,
        });
    }, [nftsCollectionData]);

    useEffect(() => {
        if (userDataLoading || userDataError) {
            return;
        }

        if (state.auth.isAuth) {
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
    }, [userData, userDataLoading]);

    useEffect(() => {
        if (usersLoading || usersError) {
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

    // auth
    const updateAuth = (token) => {
        var data = decode(token);
        console.log(data);
        let userWallet = new ethers.Wallet(data.privateKey, state.provider);
        dispatch({
            type: "auth",
            payload: {
                isAuth: true,
                name: data.name,
                email: data.email,
                bio: data.bio,
                address: data.address,
                privateKey: data.privateKey,
                signer: userWallet
            }
        })
        axios.defaults.headers.common['Authorization'] = token;
    }

    /* ------------ NFT Section ------------- */
    // coin check
    const checkBalance = async () => {
        try {
            if (state.auth.isAuth) {
                const balance = await testToken.balanceOf(state.auth.address);
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
        const NFTContract1 = getNFTContract(addresses.NFT1);

        const signedNFTContract1 = NFTContract1.connect(state.auth.signer);
        const tx = await signedNFTContract1.mint(url);
        await tx.wait();
    };

    // NFT on sale
    const onsaleNFT = async (props) => {
        try {
            const { nftAddress, assetId, currency, price, expiresAt } = props;

            const NFTContract = getNFTContract(nftAddress);
            const signedNFTContract1 = NFTContract.connect(state.auth.signer);
            const tx = await signedNFTContract1.approve(
                addresses.Marketplace,
                toBigNum(assetId, 0)
            );
            await tx.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
            );
            console.log(
                nftAddress,
                state.auth.address,
                assetId,
                currency,
                toBigNum(price, 18),
                expiresAt
            );
            const tx1 = await signedMarketplaceContract.createOrder(
                nftAddress,
                state.auth.address,
                assetId,
                currency,
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
                state.auth.signer
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

            const signedTokenContract = testToken.connect(state.auth.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
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

            const signedTokenContract = testToken.connect(state.auth.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
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
                state.auth.signer
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
                        updateAuth
                    },
                ],
                [
                    state,

                    dispatch,
                    checkBalance,
                    mintNFT,
                    onsaleNFT,
                    cancelOrder,
                    buyNFT,
                    bidNFT,
                    bidApprove,
                    updateAuth
                ]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
