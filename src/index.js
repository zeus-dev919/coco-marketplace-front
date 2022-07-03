import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { UseWalletProvider } from "use-wallet";
import { NotificationContainer } from "react-notifications";

import "@1stquad/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css";
import "react-notifications/lib/notifications.css";
import "font-awesome/css/font-awesome.min.css";
import "elegant-icons/style.css";
import "et-line/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/animated.css";
import "./assets/style.scss";


import App from "./components/app";
import Provider from "./context";

const client = new ApolloClient({
    uri: "http://192.168.115.178:5000/graphql/",
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <UseWalletProvider
                chainId={4002}
                connectors={{}}
            >
                <Provider>
                    <App />
                    <NotificationContainer />
                </Provider>
            </UseWalletProvider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
