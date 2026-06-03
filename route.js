import './globals.css';

export const metadata = {
  title: 'World Cup 2026 Pick\'em Pool',
  description: 'Office pick\'em for the 2026 FIFA World Cup',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
