import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import Layout from "./_layout";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
    title: "freeloaders",
    description: "insert slogan here",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
            <Layout>
                <Navbar />
                {children}
            </Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
