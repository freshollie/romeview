import React, { Component } from "react";
import "./Translator.css";

import * as romegen from "../api/romegen";

export default class Translator extends Component {
  // String constants
  OUTPUT_PLACEHOLDER = "Output";

  NUMERALS_TEXT = "Numerals";
  DECIMAL_TEXT = "Decimal";

  constructor(props) {
    super(props);

    this.state = {
      output: this.OUTPUT_PLACEHOLDER,
      forwards: true,
      errorMessage: ""
    };

    this.handleInput.bind(this);
    this.switchDirection.bind(this);
  }

  /**
   * Switch the translation direction
   */
  switchDirection = () => {
    this.setState({ forwards: !this.state.forwards });
  };

  /**
   * Handle automatically updating
   * the output when we get any input
   */
  handleInput = async event => {
    const inputText = event.target.value;

    this.setState({ errorMessage: "" });

    if (inputText.length === 0) {
      this.setState({ output: this.OUTPUT_PLACEHOLDER });
      return;
    }

    try {
      if (this.state.forwards) {
        this.setState({ output: await romegen.toNumerals(inputText) });
      } else {
        this.setState({ output: await romegen.toDecimal(inputText) });
      }
    } catch (e) {
      // Pull errors from api
      if (e.response) {
        if (
          e.response.status === 422 &&
          e.response.data &&
          e.response.data.error
        ) {
          this.setState({ errorMessage: e.response.data.error });
        } else {
          this.setState({ errorMessage: "Server error" });
        }
      } else {
        this.setState({ errorMessage: "Unknown error" });
      }

      this.setState({ output: this.OUTPUT_PLACEHOLDER });
    }
  };

  render() {
    return (
      <div>
        <div className="input-title">
          {this.state.forwards ? this.DECIMAL_TEXT : this.NUMERALS_TEXT}
        </div>
        <div>
          <input
            type="text"
            onChange={this.handleInput}
            placeholder={
              this.state.forwards
                ? "Type a decimal up to 3999"
                : "Type a set a numerals"
            }
          />
        </div>
        <div className="error">{this.state.errorMessage}</div>

        <button onClick={this.switchDirection}>{"<-->"}</button>

        <div className="output-title">
          {this.state.forwards ? this.NUMERALS_TEXT : this.DECIMAL_TEXT}
        </div>
        <div className="output">{this.state.output}</div>
      </div>
    );
  }
}
