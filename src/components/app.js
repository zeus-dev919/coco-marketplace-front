import React, { useEffect } from "react";
import { Router, Location } from "@reach/router";

import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/header";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Helpcenter from "./pages/helpcenter";
import Collection from "./pages/colection";
import ItemDetail from "./pages/ItemDetail";
import Author from "./pages/Author";
import Sign from "./pages/Sign";
import Create from "./pages/create";
import LazyCreate from "./pages/lazycreate";
import Auction from "./pages/Auction";
import Contact from "./pages/contact";
import Collections from "./pages/collections";
// import Rangking from "./pages/rangking";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
    useEffect(() => window.scrollTo(0, 0), [location]);
    return children;
};

const PosedRouter = ({ children }) => (
    <Location>
        {({ location }) => (
            <>
                <Header />
                <div id="routerhang">
                    <div key={location.key}>
                        <Router location={location}>{children}</Router>
                    </div>
                </div>
            </>
        )}
    </Location>
);

export default function App() {
    return (
        <div className="wraper">
            <GlobalStyles />
            <PosedRouter>
                <ScrollTop path="/">
                    <Home exact path="/" />
                    <Explore exact path="/explore" />
                    <Helpcenter path="/helpcenter" />
                    <Collection path="/collection/:collection" />
                    <Collections path="/Collections" />
                    <ItemDetail exact path="/ItemDetail/:collection/:id" />
                    <Author path="/Author" />
                    <Sign path="/signPage" />
                    <Create path="/create" />
                    <LazyCreate path="/lazy-mint" />
                    <Auction exact path="/Auction/:collection/:id" />
                    <Contact path="/contact" />
                </ScrollTop>
                <Home default />
            </PosedRouter>
            <ScrollToTopBtn />
        </div>
    );
}
