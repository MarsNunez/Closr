import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { AuthModalProvider } from "./providers/AuthModalProvider";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

export const metadata = {
  title: "Closr — Conecta con tus creadores favoritos",
  description:
    "Descubre creadores, sigue su trabajo y únete a sus reuniones públicas o privadas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <AuthModalProvider>
            <div className="flex min-h-screen flex-col">
              <NavBar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
