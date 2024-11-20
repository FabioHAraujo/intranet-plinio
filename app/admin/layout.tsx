export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          {/* Layout específico da página de administração */}
          {children}
        </body>
      </html>
    );
  }
  