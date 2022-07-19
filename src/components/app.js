import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/header";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Helpcenter from "./pages/helpcenter";
import Collection from "./pages/colection";
import ItemDetail from "./pages/ItemDetail";
import Author from "./pages/Author";
import Sign from "./pages/Sign";
import CreateCollection from "./pages/createcollection";
import Create from "./pages/create";
import LazyCreate from "./pages/lazycreate";
import Auction from "./pages/Auction";
import Contact from "./pages/contact";
import Collections from "./pages/collections";
// import Rangking from "./pages/rangking";
import { useBlockchainContext } from "../context";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

const PrivateRoute = ({ children }) => {
    const location = useLocation();

    const [state, {}] = useBlockchainContext();

    if (!state.auth.isAuth) {
        return <Navigate to="/signPage" replace state={{ from: location }} />;
    }

    return children;
};

export default function App() {
    return (
        <div className="wraper">
            <Router>
                <GlobalStyles />
                <Header />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/helpcenter" element={<Helpcenter />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/Collections" element={<Collections />} />
                    <Route path="/signPage" element={<Sign />} />

                    <Route
                        exact
                        path="/collection/:collection"
                        element={
                            <PrivateRoute>
                                <Collection />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        exact
                        path="/ItemDetail/:collection/:id"
                        element={
                            <PrivateRoute>
                                <ItemDetail />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/Author"
                        element={
                            <PrivateRoute>
                                <Author />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create/collection"
                        element={
                            <PrivateRoute>
                                <CreateCollection />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create/nft"
                        element={
                            <PrivateRoute>
                                <Create />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/lazy-mint"
                        element={
                            <PrivateRoute>
                                <LazyCreate />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        exact
                        path="/Auction/:collection/:id"
                        element={
                            <PrivateRoute>
                                <Auction />
                            </PrivateRoute>
                        }
                    />
                </Routes>
                <ScrollToTopBtn />
            </Router>
        </div>
    );
}
