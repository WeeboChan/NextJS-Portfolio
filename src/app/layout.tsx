import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
    title: "Example Project",
    description: "An example project using Next.js and Tailwind CSS",
};

export default function RootLayout ({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="p-6">{children}</main>
            </body>
        </html>
    );
}