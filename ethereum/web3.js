import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //We are in the browser and metamask is installed
    web3 = new Web3(window.web3.currentProvider);
} else {
    //We are on the server and metamask is not installed
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/ad98813d140342a6879e930737d3cf1f');
    web3 = new Web3(provider);
}

export default web3;