import axios from "axios";
import { NotificationManager } from "react-notifications";

axios.defaults.baseURL = "http://192.168.115.168:5000";

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
}

const user_update = async (formData) => {
    try {
        var res = await axios.post("/api/user-update", formData);

        if (!res.data.success) {
            NotificationManager.error("Community Error");
            return false;
        }

        NotificationManager.success("Successfully updated");

        return true;
    } catch (err) {
        NotificationManager.error("Server Error");
        return false;
    }
};

// Export Functions
const Action = {
    nft_mint,
    nft_like,
    user_create,
    user_update,
    user_login,
};

export default Action;
