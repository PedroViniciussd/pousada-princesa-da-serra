import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Pousada Princesa da Serra",
  description:
    "Hospede-se com conforto e tranquilidade na Pousada Princesa da Serra. Quartos aconchegantes e uma experiência inesquecível em meio à natureza no centro da Serra do Cipó.",
  keywords: [
    "Pousada",
    "Hospedagem",
    "Serra",
    "Turismo",
    "Pousada Princesa da Serra",
    "Quartos aconchegantes",
  ],
  authors: [{ name: "Pedro Vinícius", url: "https://pedroviniciussd.github.io/portfolio-pv/" }],
  openGraph: {
    title: "Pousada Princesa da Serra",
    description:
      "Venha relaxar na Pousada Princesa da Serra. A melhor escolha para sua estadia na Serra do Cipó.",
    type: "website",
    locale: "pt_BR",
    siteName: "Pousada Princesa da Serra",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>{metadata.title}</title>
        <meta name="google-site-verification" content="DoYAvPaw0aHBJOn-C8tvDcJJex2wDiZGVtDQZYg0h80" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content="Kinkajou dev - instagram.com/kinkajou_dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}
      >
        {children}
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </body>
    </html>
  );
}
