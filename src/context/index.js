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
import { useNavigate, useLocation } from "react-router-dom";
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
    GET_USERSINFO,
    GET_COLLECTIONNFTS,
    GET_PRICES,
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
        label: "ETH",
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
    usersInfo: {},
    addresses: addresses,
    auth: {
        isAuth: false,
        user: "",
        address: "",
        bio: "",
        signer: {},
        privateKey: "",
        image: "",
    },
    balances: [0, 0],
    currencies: Currency,
    lang: "en",
    prices: {},
    gasPrice: 0,
};

export default function Provider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
    var balanceLoop = null;

    useEffect(() => {
        getGasPrice();

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
        data: usersData,
        loading: usersLoading,
        error: usersError,
    } = useQuery(GET_USERSINFO, {
        pollInterval: 500,
    });

    const {
        data: priceData,
        loading: priceLoading,
        error: priceError,
    } = useQuery(GET_PRICES, {
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
        if (priceLoading || priceError) {
            return;
        }
        dispatch({
            type: "prices",
            payload: priceData.getPrice,
        });
        console.log(state.prices);
    }, [priceData, priceLoading, priceError]);

    useEffect(() => {
        if (state.auth.isAuth) {
            balanceLoop = setInterval(() => {
                checkBalances([
                    state.currencies[0].value,
                    state.currencies[1].value,
                ]);
            }, 5000);
        } else {
            clearInterval(balanceLoop);
        }
    }, [state.auth]);

    useEffect(() => {
        const session = localStorage.getItem("marketplace_session");

        if (session) {
            updateAuth(session);
        }
    }, []);

    // get gas price
    const getGasPrice = async () => {
        if (state.provider) {
            const gasPrice = await state.provider.getGasPrice();

            dispatch({
                type: "gasPrice",
                payload: fromBigNum(gasPrice, 9),
            });
        }
    };

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
                image: data.image,
            },
        });
        axios.defaults.headers.common["Authorization"] = token;

        const origin = location.state?.from?.pathname || "/";
        navigate(origin);

        localStorage.setItem("marketplace_session", token);
    };

    /* ------------ NFT Section ------------- */
    // coin check
    const checkBalances = async (tokenaddresses) => {
        try {
            let balances = [];
            if (state.auth.isAuth) {
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

                dispatch({
                    type: "balances",
                    payload: balances,
                });
            } else {
                balances.push(0);
                balances.push(0);
                dispatch({
                    type: "balances",
                    payload: balances,
                });
            }
        } catch (err) {
            console.log("checkBalances error: ", err.message);
            return new Array(tokenaddresses.length).fill("0");
        }
    };

    const CoinTransfer = async (props) => {
        const { coinType, toAddress, amount } = props;

        try {
            if (coinType === "ETH") {
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

    const NFTTransferGas = async (props) => {
        try {
            const { id, collectionAddress, toAddress } = props;

            const NFTContract = getNFTContract(collectionAddress);
            const signedNFTContract = NFTContract.connect(state.auth.signer);
            let gas = 0;
            if (id.includes("0x")) {
                gas = await signedNFTContract.estimateGas.transferFrom(
                    state.auth.address,
                    toAddress,
                    id
                );
            } else {
                gas = await signedNFTContract.estimateGas.transferFrom(
                    state.auth.address,
                    toAddress,
                    toBigNum(id, 0)
                );
            }

            return fromBigNum(gas, 0);
        } catch (err) {
            console.log(err);
            return 0;
        }
    };

    // NFT mint
    const mintNFT = async (url, collection) => {
        const NFTContract1 = getNFTContract(collection);

        const signedNFTContract1 = NFTContract1.connect(state.auth.signer);
        const tx = await signedNFTContract1.mint(url);
        await tx.wait();
    };
    const estimateMintNFT = async (url, collection) => {
        const NFTContract1 = getNFTContract(collection);

        const signedNFTContract1 = NFTContract1.connect(state.auth.signer);
        const gas = await signedNFTContract1.estimateGas.mint(url);

        return fromBigNum(gas, 0);
    };
    const estimateMintContract = async () => {
        try {
            const gas = await axios.post(
                process.env.REACT_APP_SERVERENDPOINT + "/api/get-contractgas"
            );

            return fromBigNum(gas.data.gas, 0);
        } catch (err) {
            console.log(err);
            return 0;
        }
    };

    // NFT on sale
    const onsaleNFT = async (props) => {
        try {
            const { nftAddress, assetId, currency, price, expiresAt } = props;

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
            );
            const tx = await signedMarketplaceContract.createOrder(
                nftAddress,
                state.auth.address,
                assetId,
                currency,
                price,
                expiresAt
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const approveNFT = async (props) => {
        try {
            const { assetId, nftAddress } = props;

            const NFTContract = getNFTContract(nftAddress);
            const signedNFTContract1 = NFTContract.connect(state.auth.signer);

            const tx = await signedNFTContract1.approve(
                addresses.Marketplace,
                assetId
            );
            await tx.wait();

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const checkNFTApprove = async (props) => {
        try {
            const { assetId, nftAddress } = props;

            const NFTContract = getNFTContract(nftAddress);
            const signedNFTContract1 = NFTContract.connect(state.auth.signer);

            const owner = await signedNFTContract1.getApproved(assetId);

            if (addresses.Marketplace === owner) return true;
            else return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const ApproveNFTGas = async (props) => {
        try {
            const { assetId, nftAddress } = props;

            const NFTContract = getNFTContract(nftAddress);
            const signedNFTContract1 = NFTContract.connect(state.auth.signer);
            console.log(
                "addresses.Marketplace",
                state.auth.address,
                addresses.Marketplace
            );
            const gas = await signedNFTContract1.estimateGas.approve(
                addresses.Marketplace,
                assetId
            );

            return fromBigNum(gas, 0);
        } catch (err) {
            console.log(err);
            return 0;
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

    const onSaleGas = async (props) => {
        const { nftAddress, assetId, currency, price, expiresAt } = props;

        const signedMarketplaceContract = marketplaceContract.connect(
            state.auth.signer
        );
        const gas = await signedMarketplaceContract.estimateGas.createOrder(
            nftAddress,
            state.auth.address,
            assetId,
            currency,
            toBigNum(price, 18),
            expiresAt
        );

        return fromBigNum(gas, 0);
    };

    const onLazySaleGas = async (props) => {
        const { tokenId, priceGwei, currency, expiresAt, singature } = props;

        console.log(props);
        const signedLazyContract = storeFontContract.connect(state.auth.signer);
        const gas = await signedLazyContract.estimateGas.mintAndOnsale(
            tokenId,
            addresses.Marketplace,
            currency,
            priceGwei,
            expiresAt,
            singature
        );

        return fromBigNum(gas, 0);
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

    const buyNFTGas = async (props) => {
        try {
            const { nftAddress, assetId, price } = props;

            console.log(props);

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
            );
            const gas =
                await signedMarketplaceContract.estimateGas.ExecuteOrder(
                    nftAddress,
                    assetId,
                    toBigNum(price, 18),
                    { value: toBigNum(price, 18) }
                );
            return fromBigNum(gas, 0);
        } catch (err) {
            console.log(err);
            return 0;
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

    const bidNFTGas = async (props) => {
        try {
            const { nftAddress, assetId, price, expiresAt } = props;

            const signedMarketplaceContract = marketplaceContract.connect(
                state.auth.signer
            );
            const gas = await signedMarketplaceContract.estimateGas.PlaceBid(
                nftAddress,
                assetId,
                toBigNum(price, 18),
                expiresAt,
                { value: toBigNum(price, 18) }
            );

            return fromBigNum(gas, 0);
        } catch (err) {
            console.log(err);
            return 0;
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
                        getGasPrice,
                        estimateMintNFT,
                        estimateMintContract,
                        buyNFTGas,
                        bidNFTGas,
                        NFTTransferGas,
                        onSaleGas,
                        onLazySaleGas,
                        approveNFT,
                        ApproveNFTGas,
                        checkNFTApprove,
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
                    getGasPrice,
                    estimateMintNFT,
                    estimateMintContract,
                    buyNFTGas,
                    bidNFTGas,
                    NFTTransferGas,
                    onSaleGas,
                    onLazySaleGas,
                    approveNFT,
                    ApproveNFTGas,
                    checkNFTApprove,
                ]
            )}
        >
            {children}
        </BlockchainContext.Provider>
    );
}
