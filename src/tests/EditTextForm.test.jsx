import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EditTextForm from "../components/EditTextForm";

describe("<EditTextForm />", () => {
  it("renders correctly with initial node name", () => {
    const { getByText, getByDisplayValue } = render(
      <EditTextForm nodeName="Action 1" onSave={() => {}} />
    );

    getByText("Edit Node name");
    getByDisplayValue("Action 1");
  });

  it("updates text input value on change", () => {
    const { getByDisplayValue } = render(
      <EditTextForm nodeName="Action 1" onSave={() => {}} />
    );

    const input = getByDisplayValue("Action 1");
    fireEvent.changeText(input, "Updated Node");

    getByDisplayValue("Updated Node");
  });

  it("calls onSave with the updated node name", () => {
    const handleSave = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <EditTextForm nodeName="Action 1" onSave={handleSave} />
    );

    const input = getByDisplayValue("Action 1");
    fireEvent.changeText(input, "Updated Node");

    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    expect(handleSave).toHaveBeenCalledWith("Updated Node");
  });
});
