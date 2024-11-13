import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { InfoProvider } from "./context/info"; // global variables
import { I18nextProvider } from "react-i18next"; // multi language support
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <InfoProvider>
      <App />
    </InfoProvider>
  </I18nextProvider>
);
