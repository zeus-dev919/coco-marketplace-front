import { gql } from "@apollo/client";

/* ----- Query ----- */
const GET_COLLECTIONNFTS = gql`
    query Query {
        getCollectionNFTs {
            address
            metadata {
                name
                description
                coverImage
                image
                external_url
                fee
                fee_recipent
            }
            items {
                metadata {
                    image
                    external_url1
                    external_url2
                    external_url3
                    external_url4
                    description
                    name
                    attributes {
                        value
                        key
                    }
                }
                tokenID
                collectionAddress
                likes
                creator
                owner
                isOffchain
                marketdata {
                    bidder
                    bidPrice
                    price
                    owner
                    startTime
                    endTime
                    prices
                    tokens
                    owners
                    bidders
                    bidPrices
                    bidTokens
                    bidTime
                    acceptedToken
                }
            }
        }
    }
`; // Get All NFTs by Collection

const GET_ALLNFTS = gql`
    query Query {
        getAllNFTs {
            tokenID
            collectionAddress
            likes
            creator
            owner
            isOffchain
            metadata {
                image
                external_url1
                external_url2
                external_url3
                external_url4
                description
                name
                attributes {
                    key
                    value
                }
            }
            marketdata {
                price
                owner
                startTime
                endTime
                bidder
                bidPrice
                prices
                owners
                bidders
                bidPrices
                bidTime
                acceptedToken
            }
        }
    }
`; // Get All NFTs

const GET_USERSINFO = gql`
    query GetUserInfo {
        getUsersInfo {
            address
            name
            bio
            email
            image
            coverimage
            backgroundimage
            follow
            description
        }
    }
`;

export { GET_COLLECTIONNFTS, GET_ALLNFTS, GET_USERSINFO };
