import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Faraódex",
  description: "Um site que mostra como a parceria entre o Mangádex e o Velvet funciona.",
  openGraph: {
    title: "Faraódex",
    description: "Um site que mostra como a parceria entre o Mangádex e o Velvet funciona.",
    images: [
      {
        url: "/brand.png",
        width: 1200,
        height: 630,
        alt: "Faraó Mangás logo"
      }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
