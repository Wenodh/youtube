import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./utils/appSlice";

test("renders a component with the Redux application state", () => {
  const store = configureStore({ reducer: { app: appReducer } });
  render(<Provider store={store}><div>Application test harness</div></Provider>);
  expect(screen.getByText("Application test harness")).toBeInTheDocument();
});
