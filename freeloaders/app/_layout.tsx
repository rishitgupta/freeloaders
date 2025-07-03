"use client"

import { ThemeProvider } from "styled-components";
import theme from "./lib/tokens";
import { SessionProvider } from "next-auth/react";

// Created as a client-side component to establish the layout
const Layout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    )
}

export default Layout