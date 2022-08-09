import React, { useState } from "react";
// import Select from "react-select";

import NFTLists from "../components/NFTLists";
import Footer from "../menu/footer";
import { useBlockchainContext } from "../../context";

// const customStyles = {
//     option: (base, state) => ({
//         ...base,
//         background: "#212428",
//         color: "#fff",
//         borderRadius: state.isFocused ? "0" : 0,
//         "&:hover": {
//             background: "#16181b",
//         },
//     }),
//     menu: (base) => ({
//         ...base,
//         background: "#212428 !important",
//         borderRadius: 0,
//         marginTop: 0,
//     }),
//     menuList: (base) => ({
//         ...base,
//         padding: 0,
//     }),
//     control: (base, state) => ({
//         ...base,
//         padding: 2,
//     }),
// };

// const options = [
//     { value: "All categories", label: "All categories" },
//     { value: "Art", label: "Art" },
//     { value: "Music", label: "Music" },
//     { value: "Domain Names", label: "Domain Names" },
// ];
// const options1 = [
//     { value: "Buy Now", label: "Buy Now" },
//     { value: "On Auction", label: "On Auction" },
//     { value: "Has Offers", label: "Has Offers" },
// ];
// const options2 = [
//     { value: "All Items", label: "All Items" },
//     { value: "Single Items", label: "Single Items" },
//     { value: "Bundles", label: "Bundles" },
// ];

export default function Explore() {
    const [state, { translateLang }] = useBlockchainContext();
    const [searchWord, setSearchWord] = useState("");

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    {translateLang("allnft_title")}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="items_filter">
                            <form
                                className="row form-dark"
                                id="form_quick_search"
                                name="form_quick_search"
                            >
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name_1"
                                        name="name_1"
                                        placeholder={translateLang("seachtext")}
                                        onChange={(e) =>
                                            setSearchWord(e.target.value)
                                        }
                                        value={searchWord}
                                    />
                                    <button id="btn-submit">
                                        <i className="fa fa-search bg-color-secondary"></i>
                                    </button>
                                    <div className="clearfix"></div>
                                </div>
                            </form>
                            {/* <div className="dropdownSelect one">
                                <Select
                                    className="select1"
                                    styles={customStyles}
                                    menuContainerStyle={{ zIndex: 999 }}
                                    defaultValue={options[0]}
                                    options={options}
                                />
                            </div>
                            <div className="dropdownSelect two">
                                <Select
                                    className="select1"
                                    styles={customStyles}
                                    defaultValue={options1[0]}
                                    options={options1}
                                />
                            </div>
                            <div className="dropdownSelect three">
                                <Select
                                    className="select1"
                                    styles={customStyles}
                                    defaultValue={options2[0]}
                                    options={options2}
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
                <NFTLists />
            </section>

            <Footer />
        </div>
    );
}
