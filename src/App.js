import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lotteryContract from "./lottery";
import React, { useEffect, useState } from "react";

const App = () => {
  const [manager, setManager] = useState('');
  web3.eth.getAccounts().then(console.log);
  useEffect(async () => {
    // assign the manager variable to a manager().call() method in the 
    // lottery contract. we don't need to provide the `from` argument
    // as the metamask provider in our web3 does not require it.
    const manager = await lotteryContract.methods.manager().call();
    setManager(manager);
  }, []);
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by: {manager}</p>
    </div>
  );
};

export default App;
