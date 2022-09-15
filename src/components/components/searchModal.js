import { useNavigate } from "react-router-dom";

export default function SearchModal(props) {
    const { className, collectionDatas, nftDatas } = props;

    return (
        <div className={"searchModal " + className}>
            <h5>Collections</h5>
            <hr />
            <div className="spacer-10"></div>
            <div className="row">
                {collectionDatas.map((item, index) => (
                    <CollectionItem
                        image={item.metadata.coverImage}
                        address={item.address}
                        itemcount={item.items.length}
                    />
                ))}
            </div>
            <div className="spacer-single"></div>
            <h5>NFTs</h5>
            <hr />
            <div className="spacer-10"></div>
            <div className="row">
                {nftDatas.map((item, index) => (
                    <NFTItem
                        image={item.metadata.image}
                        name={item.metadata.name}
                        address={item.owner}
                        collectionAddress={item.collectionAddress}
                        tokenID={item.tokenID}
                    />
                ))}
            </div>
        </div>
    );
}

const CollectionItem = (props) => {
    const { image, address, itemcount } = props;
    const navigate = useNavigate();

    return (
        <div className="col-sm-12 col-md-4">
            <div
                className="search__item"
                onClick={() => navigate(`/collection/${address}`)}
            >
                <div>
                    <img src={image} alt="" />
                </div>
                <div>
                    <h6>{address.slice(0, 4) + "..." + address.slice(-4)}</h6>
                    <p>{itemcount} items</p>
                </div>
            </div>
        </div>
    );
};

const NFTItem = (props) => {
    const { image, name, address, collectionAddress, tokenID } = props;
    const navigate = useNavigate();

    return (
        <div className="col-sm-12 col-md-4">
            <div
                className="search__item"
                onClick={() =>
                    navigate(`/ItemDetail/${collectionAddress}/${tokenID}`)
                }
            >
                <div>
                    <img src={image} alt="" />
                </div>
                <div>
                    <h6>{name.length > 9 ? name.slice(0, 8) + "..." : name}</h6>
                    <p>{address.slice(0, 4) + "..." + address.slice(-4)}</p>
                </div>
            </div>
        </div>
    );
};
