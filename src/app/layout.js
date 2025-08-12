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
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-white text-gray-900">
        {children}
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </body>
    </html>
  );
}
