import { ethers } from "ethers";
function delay(delayTimes) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, delayTimes);
    });
}

function toBigNum(value, d = 18) {
    return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

function fromBigNum(value, d = 18) {
    try {
        return parseFloat(ethers.utils.formatUnits(value, d));
    } catch (err) {
        console.log("fromBigNum error", value);
        return "0"
    }
}

const styledAddress = (s = "") => {
    if (s && s.length > 10) return s.slice(0, 4) + "..." + s.slice(-4);
    else return s;
};

export { delay, toBigNum, fromBigNum, styledAddress };
