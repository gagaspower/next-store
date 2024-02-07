import type { Metadata } from "next";
import "@/globals.css";
import Providers from "@/context/providers";
import { SessionProvider } from "@/context/sessionProvider";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/cartProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Next Store",
    default: "Next Store", // a default is required when creating a template
  },
  description: "Generated by create next app",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Next Store",
    description:
      "Next Store merupakan situs penjualan online aneka produk fashion",
    url: "http://localhost:3000",
    siteName: "Next Store",
    images: [
      {
        url: "http://localhost:3000/bag.png", // Must be an absolute URL
        width: 500,
        height: 500,
      },
      {
        url: "http://localhost:3000/bag.png", // Must be an absolute URL
        width: 500,
        height: 500,
        alt: "Next Store Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        <Providers>
          <SessionProvider>
            <CartProvider>{children}</CartProvider>
          </SessionProvider>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
