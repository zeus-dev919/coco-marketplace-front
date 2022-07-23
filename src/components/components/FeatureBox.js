import React from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import { useBlockchainContext } from "../../context";

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

const Featurebox = () => {
    const [state, { translateLang }] = useBlockchainContext();

    return (
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
                            <h4 className="color">
                                {translateLang("feature_title1")}
                            </h4>
                        </Reveal>
                        <Reveal
                            className="onStep"
                            keyframes={fadeInUp}
                            delay={200}
                            duration={600}
                            triggerOnce
                        >
                            <p className="feature-font">
                                {translateLang("feature_txt1")}
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
                            <h4 className="color">
                                {translateLang("feature_title2")}
                            </h4>
                        </Reveal>
                        <Reveal
                            className="onStep"
                            keyframes={fadeInUp}
                            delay={200}
                            duration={600}
                            triggerOnce
                        >
                            <p className="feature-font">
                                {translateLang("feature_txt2")}
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
                            <h4 className="color">
                                {translateLang("feature_title3")}
                            </h4>
                        </Reveal>
                        <Reveal
                            className="onStep"
                            keyframes={fadeInUp}
                            delay={200}
                            duration={600}
                            triggerOnce
                        >
                            <p className="feature-font">
                                {translateLang("feature_txt3")}
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
                            <h4 className="color">
                                {translateLang("feature_title4")}
                            </h4>
                        </Reveal>
                        <Reveal
                            className="onStep"
                            keyframes={fadeInUp}
                            delay={200}
                            duration={600}
                            triggerOnce
                        >
                            <p className="feature-font">
                                {translateLang("feature_txt4")}
                            </p>
                        </Reveal>
                    </div>
                    <i className="wm icon_tags_alt"></i>
                </div>
            </div>
        </div>
    );
};

export default Featurebox;
