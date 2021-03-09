import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lotteryContract from "./lottery";
import React, { useMemo, useState } from "react";

const App = () => {
  // State variables. All represent the lottery.sol contract state
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("0");
  const [message, setMessage] = useState("");
  const [lastWinner, setLastWinner] = useState("");

  // called before render
  useMemo(async () => {
    // assign the manager variable to a manager().call() method in the
    // lottery contract. we don't need to provide the `from` argument
    // as the metamask provider in our web3 does not require it.
    const manager = await lotteryContract.methods.manager().call();
    setManager(manager);

    // same thing for players variable
    const players = await lotteryContract.methods.returnPlayers().call();
    setPlayers(players);

    // .. and balance
    const balance = await web3.eth.getBalance(lotteryContract.options.address);
    setBalance(balance);
  }, []);

  const onEnter = async (event) => {
    // prevents the form from submitting itself
    event.preventDefault();
    // get the accounts from metamask
    const accounts = await web3.eth.getAccounts();

    // Since we clicked Enter, we are awaiting the transaction to work
    setMessage("Waiting for our transaction to succeed");

    // Wait for the enter() method to transact successfully with {value}
    // amount of ether
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });

    // After the transaction successfully passes, we set the message!
    setMessage("You have successfully entered in the lottery!");
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Picking winner, please wait for this transaction to pass");
    await lotteryContract.methods.pickWinner().send({ from: accounts[0] });
    // Who is our winner?
    const winner = await lotteryContract.methods.lastWinner().call();
    setLastWinner(winner);
    setMessage(
      `The winner ${lastWinner} has been picked and they have won ${web3.utils.fromWei(
        balance,
        "ether"
      )} ethers!`
    );
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by: {manager} <br />
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={onEnter}>
        <h4> Want to try your luck? </h4>
        <div>
          <label>Amount of ether to enter:</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinner}>Pick a winner!</button>
      <hr />
      <h5> {message} </h5>
    </div>
  );
};

export default App;
