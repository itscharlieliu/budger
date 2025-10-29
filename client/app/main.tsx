import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import App from "./App";
import { shouldForwardProp } from "./utils/styledHelpers";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StyleSheetManager>
    </React.StrictMode>,
);
