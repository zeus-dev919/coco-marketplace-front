import React from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const featurebox = () => (
    <div className="row gy-5">
        <div className="col-lg-6 col-md-6">
            <div className="feature-box f-boxed style-3">
                <Reveal
                    className="onStep"
                    keyframes={fadeInUp}
                    delay={0}
                    duration={600}
                    triggerOnce
                >
                    <i className="bg-color-2 i-boxed icon_wallet"></i>
                </Reveal>
                <div className="text">
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={100}
                        duration={600}
                        triggerOnce
                    >
                        <h4 className="color">Set up your wallet</h4>
                    </Reveal>
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={200}
                        duration={600}
                        triggerOnce
                    >
                        <p className="feature-font">
                            Once you’ve set up your wallet of choice, connect it
                            to Crypto-Coco by clicking the wallet in the top right
                            corner.
                        </p>
                    </Reveal>
                </div>
                <i className="wm icon_wallet"></i>
            </div>
        </div>

        <div className="col-lg-6 col-md-6">
            <div className="feature-box f-boxed style-3">
                <Reveal
                    className="onStep"
                    keyframes={fadeInUp}
                    delay={0}
                    duration={600}
                    triggerOnce
                >
                    <i className=" bg-color-2 i-boxed icon_pencil-edit_alt"></i>
                </Reveal>
                <div className="text">
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={100}
                        duration={600}
                        triggerOnce
                    >
                        <h4 className="color">Create your collection</h4>
                    </Reveal>
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={200}
                        duration={600}
                        triggerOnce
                    >
                        <p className="feature-font">
                            Click My Collections and set up your collection. Add
                            social links, a description, profile & banner
                            images, and set a secondary sales fee.
                        </p>
                    </Reveal>
                </div>
                <i className="wm icon_pencil-edit_alt"></i>
            </div>
        </div>

        <div className="col-lg-6 col-md-6">
            <div className="feature-box f-boxed style-3">
                <Reveal
                    className="onStep"
                    keyframes={fadeInUp}
                    delay={0}
                    duration={600}
                    triggerOnce
                >
                    <i className=" bg-color-2 i-boxed icon_images"></i>
                </Reveal>
                <div className="text">
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={100}
                        duration={600}
                        triggerOnce
                    >
                        <h4 className="color">Add your NFTs</h4>
                    </Reveal>
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={200}
                        duration={600}
                        triggerOnce
                    >
                        <p className="feature-font">
                            Upload your NFTs (image, video, audio, or 3D art),
                            add a title and description.
                        </p>
                    </Reveal>
                </div>
                <i className="wm icon_images"></i>
            </div>
        </div>

        <div className="col-lg-6 col-md-6">
            <div className="feature-box f-boxed style-3">
                <Reveal
                    className="onStep"
                    keyframes={fadeInUp}
                    delay={0}
                    duration={600}
                    triggerOnce
                >
                    <i className="bg-color-2 i-boxed icon_tags_alt"></i>
                </Reveal>
                <div className="text">
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={100}
                        duration={600}
                        triggerOnce
                    >
                        <h4 className="color">List them for sale</h4>
                    </Reveal>
                    <Reveal
                        className="onStep"
                        keyframes={fadeInUp}
                        delay={200}
                        duration={600}
                        triggerOnce
                    >
                        <p className="feature-font">
                            Choose between auctions, fixed-price listings, and
                            declining-price listings. You choose how you want to
                            sell your NFTs, and we help you sell them!
                        </p>
                    </Reveal>
                </div>
                <i className="wm icon_tags_alt"></i>
            </div>
        </div>
    </div>
);

export default featurebox;
