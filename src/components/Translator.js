import React, { Component } from "react";
import styles from "./Translator.module.css";

import * as romegen from "../api/romegen";

export default class Translator extends Component {
  // String constants
  OUTPUT_PLACEHOLDER = "Output";

  NUMERALS_TEXT = "Numerals";
  DECIMAL_TEXT = "Decimal";

  constructor(props) {
    super(props);

    this.state = {
      input: "",
      output: "",
      forwards: true,
      errorMessage: "",
      switchActive: false
    };

    this.handleInput.bind(this);
    this.switchDirection.bind(this);
  }

  /**
   * Switch the translation direction
   */
  switchDirection = () => {
    this.setState(
      { switchActive: true, forwards: !this.state.forwards },
      () => {
        this.handleInput(this.state.output);
      }
    );
  };

  showOutput(output) {
    this.setState({ output });
  }

  showErrorMessage(errorMessage) {
    this.setState({ errorMessage });
  }

  resetErrorMessage() {
    this.setState({ errorMessage: "" });
  }

  /**
   * Handle automatically updating
   * the output when we get any input
   */
  handleInput = async inputText => {
    this.setState({
      input: inputText
    });

    if (inputText.length === 0) {
      this.resetErrorMessage();
      this.showOutput("");
      return;
    }

    try {
      if (this.state.forwards) {
        this.showOutput(await romegen.toNumerals(inputText));
      } else {
        this.showOutput(await romegen.toDecimal(inputText));
      }
      this.resetErrorMessage();
    } catch (e) {
      // Pull errors from api
      if (e.response) {
        if (
          e.response.status === 422 &&
          e.response.data &&
          e.response.data.error
        ) {
          this.showErrorMessage(e.response.data.error);
        } else {
          this.showErrorMessage("Server error");
        }
      } else {
        this.showErrorMessage("Unknown error");
      }
    }
  };

  render() {
    return (
      <div className={styles.Translator}>
        <div className={styles.container}>
          <div className={styles["container-title"]} id="input-title">
            {this.state.forwards ? this.DECIMAL_TEXT : this.NUMERALS_TEXT}
          </div>
          <input
            className={
              styles.input +
              " " +
              (this.state.errorMessage.length > 0 ? styles["input-error"] : "")
            }
            type="text"
            value={this.state.input}
            onChange={e => this.handleInput(e.target.value)}
            placeholder={
              this.state.forwards
                ? "Type a decimal up to 3999"
                : "Type a set of Roman Numerals"
            }
          />
          <div className={styles.error}>{this.state.errorMessage}</div>
        </div>

        <button
          className={
            (this.state.switchActive ? [styles["swap-button-active"]] : "") +
            " " +
            styles["swap-button"]
          }
          onTransitionEnd={e => {
            this.setState({ switchActive: false });
          }}
          onClick={this.switchDirection}
        >
          {"<-->"}
        </button>

        <div className={styles.container}>
          <div className={styles["container-title"]} id="output-title">
            {this.state.forwards ? this.NUMERALS_TEXT : this.DECIMAL_TEXT}
          </div>
          <div className={styles["output-container"]}>
            <div className={styles.output}>{this.state.output}</div>
          </div>
        </div>
      </div>
    );
  }
}
