import React, { useEffect, useState } from "react";
import Breakpoint, {
    BreakpointProvider,
    setDefaultBreakpoints,
} from "react-socks";
import { useNavigate, Link } from "react-router-dom";
import useOnclickOutside from "react-cool-onclickoutside";
import { useBlockchainContext } from "../../context";

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
    <Link
        {...props}
        getProps={({ isCurrent }) => {
            // the object returned here is passed to the
            // anchor element's props
            return {
                className: isCurrent ? "active" : "non-active",
            };
        }}
    />
);

export default function Header() {
    const [state, { dispatch }] = useBlockchainContext();
    const [openMenu1, setOpenMenu1] = useState(false);
    const [openMenu2, setOpenMenu2] = useState(false);
    const [openMenu3, setOpenMenu3] = useState(false);

    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
    };
    const handleBtnClick2 = () => {
        setOpenMenu2(!openMenu2);
    };
    const handleBtnClick3 = () => {
        setOpenMenu3(!openMenu3);
    };
    const closeMenu1 = () => {
        setOpenMenu1(false);
    };
    const closeMenu2 = () => {
        setOpenMenu2(false);
    };
    const closeMenu3 = () => {
        setOpenMenu3(false);
    };
    const ref1 = useOnclickOutside(() => {
        closeMenu1();
    });
    const ref2 = useOnclickOutside(() => {
        closeMenu2();
    });
    const ref3 = useOnclickOutside(() => {
        closeMenu3();
    });
    const logout = () => {
        dispatch({
            type: "auth",
            payload: {
                isAuth: false,
            },
        });
    };

    const [showmenu, btn_icon] = useState(false);

    useEffect(() => {
        const header = document.getElementById("myHeader");
        const totop = document.getElementById("scroll-to-top");
        const sticky = header.offsetTop;
        const scrollCallBack = window.addEventListener("scroll", () => {
            btn_icon(false);
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                totop.classList.add("show");
            } else {
                header.classList.remove("sticky");
                totop.classList.remove("show");
            }
            if (window.pageYOffset > sticky) {
                closeMenu1();
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    return (
        <header id="myHeader" className="navbar white">
            <div className="container">
                <div className="row w-100-nav">
                    <div className="logo px-0">
                        <div className="navbar-title navbar-item">
                            <NavLink to="/">
                                <img
                                    src="img/logo.png"
                                    className="img-fluid d-block"
                                    alt="#"
                                />
                                <img
                                    src="img/logo.png"
                                    className="img-fluid d-3"
                                    alt="#"
                                />
                                <img
                                    src="img/logo.png"
                                    className="img-fluid d-none"
                                    alt="#"
                                />
                            </NavLink>
                        </div>
                    </div>

                    <div className="search">
                        <input
                            id="quick_search"
                            className="xs-hide"
                            name="quick_search"
                            placeholder="search item here..."
                            type="text"
                        />
                    </div>

                    <BreakpointProvider>
                        <Breakpoint l down>
                            {showmenu && (
                                <div className="menu">
                                    <div className="navbar-item">
                                        <div ref={ref1}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onClick={handleBtnClick1}
                                            >
                                                Explore
                                                <span className="lines"></span>
                                            </div>
                                            {openMenu1 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu1}
                                                    >
                                                        <NavLink
                                                            to="/explore"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            All NFTs
                                                        </NavLink>
                                                        <NavLink
                                                            to="/Collections"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="navbar-item">
                                        <NavLink
                                            to="/Author"
                                            onClick={() => btn_icon(!showmenu)}
                                        >
                                            Profile
                                            <span className="lines"></span>
                                        </NavLink>
                                    </div>

                                    <div className="navbar-item">
                                        <div ref={ref2}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onClick={handleBtnClick2}
                                            >
                                                Create
                                                <span className="lines"></span>
                                            </div>
                                            {openMenu2 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu2}
                                                    >
                                                        <NavLink
                                                            to="/create/nft"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Create NFT
                                                        </NavLink>
                                                        <NavLink
                                                            to="/create/collection"
                                                            onClick={() =>
                                                                btn_icon(
                                                                    !showmenu
                                                                )
                                                            }
                                                        >
                                                            Create Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="navbar-item">
                                        <NavLink
                                            to="/lazy-mint"
                                            onClick={() => btn_icon(!showmenu)}
                                        >
                                            Lazy Mint
                                            <span className="lines"></span>
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </Breakpoint>

                        <Breakpoint xl>
                            <div className="menu">
                                <div className="navbar-item">
                                    <div ref={ref1}>
                                        <div
                                            className="dropdown-custom dropdown-toggle btn"
                                            onMouseEnter={handleBtnClick1}
                                            onMouseLeave={closeMenu1}
                                        >
                                            Explore
                                            <span className="lines"></span>
                                            {openMenu1 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu1}
                                                    >
                                                        <NavLink to="/explore">
                                                            All NFTs
                                                        </NavLink>
                                                        <NavLink to="/Collections">
                                                            Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="navbar-item">
                                    <NavLink to="/Author">
                                        Profile
                                        <span className="lines"></span>
                                    </NavLink>
                                </div>
                                <div className="navbar-item">
                                    <div ref={ref2}>
                                        <div
                                            className="dropdown-custom dropdown-toggle btn"
                                            onMouseEnter={handleBtnClick2}
                                            onMouseLeave={closeMenu2}
                                        >
                                            Create
                                            <span className="lines"></span>
                                            {openMenu2 && (
                                                <div className="item-dropdown">
                                                    <div
                                                        className="dropdown"
                                                        onClick={closeMenu2}
                                                    >
                                                        <NavLink to="/create/nft">
                                                            Create NFT
                                                        </NavLink>
                                                        <NavLink to="/create/collection">
                                                            Create Collection
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="navbar-item">
                                    <NavLink to="/lazy-mint">
                                        Lazy Mint
                                        <span className="lines"></span>
                                    </NavLink>
                                </div>
                            </div>
                        </Breakpoint>
                    </BreakpointProvider>

                    <div className="mainside">
                        {!state.auth.isAuth ? (
                            <Link to="/signPage" className="btn-main">
                                Log In
                            </Link>
                        ) : (
                            <button className="btn-main" onClick={logout}>
                                Log Out
                            </button>
                        )}
                    </div>
                </div>
                <button
                    className="nav-icon"
                    onClick={() => btn_icon(!showmenu)}
                >
                    <div className="menu-line white"></div>
                    <div className="menu-line1 white"></div>
                    <div className="menu-line2 white"></div>
                </button>
            </div>
        </header>
    );
}
