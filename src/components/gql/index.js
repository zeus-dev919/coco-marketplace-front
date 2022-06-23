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
                    image_data
                    external_url
                    description
                    name
                    attributes {
                        value
                        key
                    }
                    background_color
                    animation_url
                    youtube_url
                }
                tokenID
                collectionAddress
                likes
                creator
                owner
                marketdata {
                    bidder
                    bidPrice
                    price
                    owner
                    startTime
                    endTime
                    prices
                    owners
                    bidders
                    bidPrices
                    bidTime
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
            metadata {
                image
                image_data
                external_url
                description
                name
                animation_url
                background_color
                youtube_url
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
            }
        }
    }
`; // Get All NFTs

const GET_USERDATA = gql`
    query GetUserInfo($account: String) {
        getUserInfo(account: $account) {
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

export { GET_COLLECTIONNFTS, GET_ALLNFTS, GET_USERDATA, GET_USERSINFO };
