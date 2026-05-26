import "./globals.css";
export const metadata = { title: "FreshDeck", description: "A smart pantry tracker that tells you what to cook based on what's about to expire in your fridge." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
