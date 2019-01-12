import React from "react";
import ReactDOM from "react-dom";
import flushPromises from "flush-promises";
import { shallow } from "enzyme";
import Translator from "./Translator";
import renderer from "react-test-renderer";

import * as romegen from "../api/romegen";

jest.mock("../api/romegen");

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Translator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders correctly", () => {
  const tree = renderer.create(<Translator />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("has an input field", () => {
  const wrapper = shallow(<Translator />);
  expect(wrapper.find("input").exists()).toBeTruthy();
});

it("converts input to numerals on input", async () => {
  romegen.toNumerals.mockImplementation(async () => "MMII");

  const wrapper = shallow(<Translator />);
  wrapper.find("input").simulate("change", { target: { value: "2002" } });

  await flushPromises();

  expect(romegen.toNumerals).toHaveBeenCalledWith("2002");
  expect(wrapper.find(".output").text()).toBe("MMII");
});

it("allows input and output to be switched", async () => {
  const wrapper = shallow(<Translator />);

  expect(wrapper.find(".input-title").text()).toBe("Decimal");

  wrapper.find("button").simulate("click");
  expect(wrapper.find(".input-title").text()).toBe("Numerals");
});

it("allows numerals to be translated to decimals", async () => {
  romegen.toDecimal.mockImplementation(async () => 3922);

  const wrapper = shallow(<Translator />);

  // reverse the translator
  wrapper.find("button").simulate("click");
  wrapper.find("input").simulate("change", { target: { value: "MMMCMXXII" } });

  await flushPromises();

  expect(romegen.toDecimal).toHaveBeenCalledWith("MMMCMXXII");
  expect(wrapper.find(".output").text()).toBe("3922");
});

it("shows placeholder in output when nothing entered", async () => {
  const wrapper = shallow(<Translator />);

  wrapper.find("input").simulate("change", { target: { value: "" } });

  await flushPromises();
  expect(wrapper.find(".output").text()).toBe("Output");
});

async function testErrorMessage(error, message) {
  romegen.toNumerals.mockImplementation(async () => {
    throw error;
  });
  const wrapper = shallow(<Translator />);

  wrapper.find("input").simulate("change", { target: { value: "MMMCMXXII" } });

  await flushPromises();

  expect(wrapper.find(".error").text()).toBe(message);
}

it("shows any errors from api", async () => {
  await testErrorMessage(
    {
      response: {
        status: 422,
        data: {
          error: "Some error"
        }
      }
    },
    "Some error"
  );
});

it("shows error messages from failure", async () => {
  await testErrorMessage(
    {
      response: {
        status: 500
      }
    },
    "Server error"
  );

  await testErrorMessage(new Error("Idk what this is"), "Unknown error");
});

it("clears error messages on input", async () => {
  romegen.toNumerals.mockImplementation(async () => {
    throw new Error("Some error");
  });
  const wrapper = shallow(<Translator />);
  wrapper.find("input").simulate("change", { target: { value: "MMMCMXXII" } });

  await flushPromises();

  expect(wrapper.find(".error").text()).toBe("Unknown error");

  wrapper.find("input").simulate("change", { target: { value: "asasd" } });
  expect(wrapper.find(".error").text()).toBe("");
});

it("clears output on error", async () => {
  romegen.toNumerals.mockImplementation(async () => {
    throw new Error("Some error");
  });
  const wrapper = shallow(<Translator />);
  wrapper.find("input").simulate("change", { target: { value: "MMMCMXXII" } });

  await flushPromises();

  // Placeholder text
  expect(wrapper.find(".output").text()).toBe("Output");
});
