"use client";

import React from "react";
import { Provider } from "react-redux";
import configureStore from "../src/store/configureStore";

const store = configureStore();

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
