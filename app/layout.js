import "./globals.css";

export const metadata = {
  title: "Canopée — Traçabilité EUDR",
  description: "Collecte et conformité EUDR pour coopératives agricoles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
