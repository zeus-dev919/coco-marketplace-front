import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "@reach/router";
import { useBlockchainContext } from "../../context";

const settings = {
    infinite: false,
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 4,
    responsive: [
        {
            breakpoint: 1900,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: false,
            },
        },
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: false,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: false,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
            },
        },
    ],
};

export default function CarouselCollection() {
    const navigate = useNavigate();
    const [state, { }] = useBlockchainContext();

    const NFTItem = (props) => {
        const { desc, title, coverImage, image, id, address } = props;

        const handle = () => {
            navigate(`/collection/${address}`);
        };

        return (
            <div className="itm" index={id}>
                <div className="nft_coll">
                    <span onClick={handle}>
                        <div className="nft_wrap">
                            <span>
                                <img
                                    src={coverImage}
                                    className="lazy img-fluid"
                                    alt=""
                                />
                            </span>
                        </div>
                        <div className="nft_coll_pp">
                            <span>
                                <img className="lazy" src={image} alt="" />
                            </span>
                        </div>
                    </span>
                    <div className="nft_coll_info">
                        <span>
                            <h4>{title}</h4>
                        </span>
                        <span>{desc}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="nft">
            <Slider {...settings}>
                {state.collectionNFT.map((item, index) => (
                    <NFTItem
                        key={index}
                        id={index}
                        title={item.metadata.name}
                        desc={item.metadata.description}
                        coverImage={item.metadata.coverImage}
                        image={item.metadata.image}
                        address={item.address}
                    />
                ))}
            </Slider>
        </div>
    );
}
