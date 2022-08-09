import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
} from "react";
import { ethers } from "ethers";
import { useQuery } from "@apollo/client";
import decode from "jwt-decode";
import axios from "axios";

import {
    getNFTContract,
    getTokenContract,
    marketplaceContract,
    storeFontContract,
    provider,
    testToken,
} from "../contracts";
import { fromBigNum, toBigNum } from "../utils";
import {
    GET_ALLNFTS,
    GET_USERDATA,
    GET_USERSINFO,
    GET_COLLECTIONNFTS,
} from "../components/gql";
import addresses from "../contracts/contracts/addresses.json";

import { translations } from "../components/language/translate";

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
        value: addresses.WETH,
    },
    {
        label: "BUSD",
        value: addresses.TestToken,
    },
];

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
        bio: "",
        signer: {},
        privateKey: "",
    },
    tokenPrice: {
        BNB: 0,
        BUSD: 0,
    },
    balances: [],
    currencies: Currency,
    lang: "en",
};

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    useEffect(() => {
        checkPrice();
        setTimeout(() => {
            checkPrice();
        }, 15000);

        let savedLang = localStorage.getItem("lang");
        if (savedLang) setLanguage({ newLang: savedLang });
        else setLanguage({ newLang: "en" });
    }, []);

    /** Begin GraphQL Query */
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
    /** End GraphQL Query */

    useEffect(() => {
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
    }, [nftsCollectionData, nftsCollectionLoading, nftsCollectionError]);

    // user info
    useEffect(() => {
        if (userDataLoading || userDataError) {
            return;
        }

        if (state.auth.isAuth) {
            dispatch({
                type: "userInfo",
                payload: userData.getUserInfo ? userData.getUserInfo : {},
            });
            let tokenlist = state.currencies.map((currency) => currency.value);
            checkBalances(tokenlist);
        } else {
            dispatch({
                type: "userInfo",
                payload: {},
            });
        }
    }, [userData, userDataLoading, userDataError, state.auth.isAuth]);

    // users info
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
    }, [usersData, usersLoading, usersError]);

    useEffect(() => {
        (async () => {
            let result = await checkBalances([
                state.currencies[0].value,
                state.currencies[1].value,
            ]);
            dispatch({
                type: "balances",
                payload: result,
            });
        })();
    }, [state.auth]);

    // set language
    const setLanguage = (props) => {
        const { newLang } = props;
        dispatch({
            type: "lang",
            payload: newLang,
        });

        localStorage.setItem("lang", newLang);
    };

    const translateLang = (txt) => {
        return translations[state.lang][txt];
    };

    // auth
    const updateAuth = (token) => {
        var data = decode(token);
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
                signer: userWallet,
            },
        });
        axios.defaults.headers.common["Authorization"] = token;
    };

    /* ------------ NFT Section ------------- */
    // check Price bnb and busd
    const checkPrice = async () => {
        var promiseArray = [];
        promiseArray.push(
            axios.get("https://api.binance.com/api/v3/avgPrice?symbol=BNBEUR"),
            axios.get("https://api.binance.com/api/v3/avgPrice?symbol=EURBUSD")
        );

        const [BNBPrice, BUSDPrice] = await Promise.all(promiseArray);

        dispatch({
            type: "tokenPrice",
            payload: {
                BNB: BNBPrice.data.price,
                BUSD: BUSDPrice.data.price,
            },
        });
    };

    // coin check
    const checkBalances = async (tokenaddresses) => {
        try {
            if (state.auth.isAuth) {
                let balances = [];
                for (let i = 0; i < tokenaddresses.length; i++) {
                    //native coin
                    if (
                        tokenaddresses[i].toLowerCase() ===
                        state.currencies[0].value.toLowerCase()
                    ) {
                        let balance = await state.provider.getBalance(
                            state.auth.address
                        );
                        balances.push(fromBigNum(balance, 18));
                    } else {
                        var token = getTokenContract(tokenaddresses[i]);
                        let balance = await token.balanceOf(state.auth.address);
                        balances.push(fromBigNum(balance, 18));
                    }
                }
                return balances;
            } else {
                return new Array(tokenaddresses.length).fill("0");
            }
        } catch (err) {
            console.log("checkBalances error: ", err.message);
            return new Array(tokenaddresses.length).fill("0");
        }
    };

    const CoinTransfer = async (props) => {
        const { coinType, toAddress, amount } = props;

        try {
            if (coinType === "BNB") {
                const tx = {
                    from: state.auth.address,
                    to: toAddress,
                    value: ethers.utils.parseEther(amount),
                };

                await state.auth.signer.sendTransaction(tx);
            } else {
                const signedTestToken = testToken.connect(state.auth.signer);
                const tx = await signedTestToken.approve(toAddress, amount);
                await tx.wait();

                const tx1 = await signedTestToken.transferFrom(
                    state.auth.address,
                    toAddress,
                    amount
                );
                await tx1.wait();
            }
            let result = await checkBalances([
                state.currencies[0].value,
                state.currencies[1].value,
            ]);
            dispatch({
                type: "balances",
                payload: result,
            });

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const NFTTransfer = async (props) => {
        try {
            const { id, collectionAddress, toAddress } = props;
            const NFTContract = getNFTContract(collectionAddress);

            const signedNFTContract = NFTContract.connect(state.auth.signer);
            if (id.includes("0x")) {
                const tx = await signedNFTContract.transferFrom(
                    state.auth.address,
                    toAddress,
                    id
                );
                await tx.wait();
            } else {
                const tx = await signedNFTContract.transferFrom(
                    state.auth.address,
                    toAddress,
                    toBigNum(id, 0)
                );
                await tx.wait();
            }

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    // NFT mint
    const mintNFT = async (url, collection) => {
        const NFTContract1 = getNFTContract(collection);

        const signedNFTContract1 = NFTContract1.connect(state.auth.signer);
        const tx = await signedNFTContract1.mint(url);
        await tx.wait();
    };

    // NFT on sale
    const onsaleNFT = async (props) => {
        try {
            const { nftAddress, assetId, currency, price, expiresAt, flag } =
                props;

            if (flag === 1) {
                const NFTContract = getNFTContract(nftAddress);
                const signedNFTContract1 = NFTContract.connect(
                    state.auth.signer
                );
                const tx = await signedNFTContract1.approve(
                    addresses.Marketplace,
                    toBigNum(assetId, 0)
                );
                await tx.wait();

                let bigprice = toBigNum(price, 18);

                const signedMarketplaceContract = marketplaceContract.connect(
                    state.auth.signer
                );
                const tx1 = await signedMarketplaceContract.createOrder(
                    nftAddress,
                    state.auth.address,
                    assetId,
                    currency,
                    bigprice,
                    expiresAt
                );
                await tx1.wait();

                return true;
            } else {
                const NFTContract = getNFTContract(nftAddress);
                const signedNFTContract1 = NFTContract.connect(
                    state.auth.signer
                );
                const tx = await signedNFTContract1.approve(
                    addresses.Marketplace,
                    assetId
                );
                await tx.wait();

                const signedMarketplaceContract = marketplaceContract.connect(
                    state.auth.signer
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
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    // on sale lazy nfts
    const onsaleLazyNFT = async (props) => {
        const { tokenId, priceGwei, currency, expiresAt, singature } = props;
        const signedLazyContract = storeFontContract.connect(state.auth.signer);

        const tx = await signedLazyContract.mintAndOnsale(
            tokenId,
            addresses.Marketplace,
            currency,
            priceGwei,
            expiresAt,
            singature
        );
        await tx.wait();

        return true;
    };

    const cancelOrder = async (props) => {
        const { nftAddress, assetId } = props;

        const signedMarketplaceContract = marketplaceContract.connect(
            state.auth.signer
        );
        const tx = await signedMarketplaceContract.cancelOrder(
            nftAddress,
            assetId
        );
        await tx.wait();
    };

    // NFT buy and bid
    const buyNFT = async (props) => {
        const { nftAddress, assetId, price, acceptedToken } = props;

        const signedMarketplaceContract = marketplaceContract.connect(
            state.auth.signer
        );
        if (
            acceptedToken.toLowerCase() ===
            state.currencies[0].value.toLowerCase()
        ) {
            //native coin
            const tx = await signedMarketplaceContract.ExecuteOrder(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                { value: toBigNum(price, 18) }
            );
            await tx.wait();
        } else {
            //ERC20
            var token = getTokenContract(acceptedToken);
            const signedTokenContract = token.connect(state.auth.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const tx = await signedMarketplaceContract.ExecuteOrder(
                nftAddress,
                assetId,
                toBigNum(price, 18)
            );
            await tx.wait();
        }
    };

    const bidNFT = async (props) => {
        const { nftAddress, assetId, price, expiresAt, acceptedToken } = props;

        const signedMarketplaceContract = marketplaceContract.connect(
            state.auth.signer
        );
        if (
            acceptedToken.toLowerCase() ===
            state.currencies[0].value.toLowerCase()
        ) {
            //native coin
            const tx = await signedMarketplaceContract.PlaceBid(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                expiresAt,
                { value: toBigNum(price, 18) }
            );
            await tx.wait();
        } else {
            //ERC20
            var token = getTokenContract(acceptedToken);
            const signedTokenContract = token.connect(state.auth.signer);
            const tx1 = await signedTokenContract.approve(
                addresses.Marketplace,
                toBigNum(price, 18)
            );
            await tx1.wait();

            const tx = await signedMarketplaceContract.PlaceBid(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                expiresAt
            );
            await tx.wait();
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

    // show method
    const getCurrency = (tokenaddress = "") => {
        try {
            let currency = state.currencies.filter(
                (c) => c.value.toLowerCase() === tokenaddress.toLowerCase()
            );
            if (currency.length === 0) {
                throw new Error("unsupported currency");
            }
            return currency[0];
        } catch (err) {
            return {
                label: "Invalid Currency",
                value: "Unknown",
            };
        }
    };

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        checkBalances,
                        mintNFT,
                        onsaleNFT,
                        onsaleLazyNFT,
                        cancelOrder,
                        buyNFT,
                        bidNFT,
                        bidApprove,
                        updateAuth,
                        getCurrency,
                        setLanguage,
                        translateLang,
                        CoinTransfer,
                        NFTTransfer,
                    },
                ],
                [
                    state,
                    dispatch,
                    checkBalances,
                    mintNFT,
                    onsaleNFT,
                    onsaleLazyNFT,
                    cancelOrder,
                    buyNFT,
                    bidNFT,
                    bidApprove,
                    updateAuth,
                    setLanguage,
                    translateLang,
                    CoinTransfer,
                    NFTTransfer,
                ]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
