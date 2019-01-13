import React, { Component } from "react";
import Translator from "./components/Translator";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="title">Romeview</div>
        <div className="subtitle">Translate roman numerals</div>
        <Translator />
      </div>
    );
  }
}

export default App;
