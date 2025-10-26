import React from "react";
import { Providers } from "./providers";
import "./src/index.css";

export const metadata = {
    title: "Budger",
    description: "Personal budget management application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
