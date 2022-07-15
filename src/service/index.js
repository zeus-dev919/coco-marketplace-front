import axios from "axios";
import { NotificationManager } from "react-notifications";

axios.defaults.baseURL = process.env.REACT_APP_SERVERENDPOINT;

// NFT manage
const nft_mint = async (formData) => {
    try {
        var res = await axios.post("/api/mint-nft", formData);

        if (!res.data.success) {
            NotificationManager.error("Community Error");
            return false;
        }

        return res.data;
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

const nft_like = async (data) => {
    try {
        var res = await axios.post("/api/nft-like", data);

        if (!res.data.success) {
            NotificationManager.error(res.data.msg);
            return false;
        }

        return true;
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

const lazy_mint = async (data) => {
    try {
        var res = await axios.post("/api/lazy-mint", data);

        if (!res.data.success) {
            NotificationManager.error("Community Error");
            return false;
        }

        return res.data;
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

const lazy_onsale = async (data) => {
    try {
        var res = await axios.post("/api/lazy-onsale", data);

        if (!res.data.success) {
            NotificationManager.error("Community Error");
            return false;
        }

        return res.data;
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

// User Manage
const user_create = async (account) => {
    try {
        var res = await axios.post("/api/user-create", { account: account });
        if (!res.data.status) {
            NotificationManager.error(res.data.error);
            return false;
        }

        return res.data;
    } catch (err) {
        NotificationManager.error("Server Error");
        console.log(err.message);
        return false;
    }
};

const user_login = async (account) => {
    try {
        var res = await axios.post("/api/user-login", { account: account });
        if (res.data.status) {
            return res.data;
        } else {
            return false;
        }
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

// Export Functions
const Action = {
    nft_mint,
    nft_like,
    lazy_mint,
    lazy_onsale,
    user_create,
    user_login,
};

export default Action;
