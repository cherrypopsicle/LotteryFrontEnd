import Web3 from 'web3';


// window.web3.currentProvider is currently deprecated by meta
// mask for security reasons. we now use window.ethereum() 
const provider = window.ethereum;
provider.enable();

// web3 instance that injects the windows web3 current provider.
// we do this so both the web3 on our app and the web3 that the
// user uses (metamask) on the browser are the same. 
const web3 = new Web3(provider);

export default web3;