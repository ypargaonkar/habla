import './globals.css';

export const metadata = {
  title: 'Habla - Learn Spanish',
  description: 'Conversational Spanish learning app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  );
}
