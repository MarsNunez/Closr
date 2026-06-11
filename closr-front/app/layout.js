import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { AuthModalProvider } from "./providers/AuthModalProvider";
import { ThemeProvider, themeScript } from "./providers/ThemeProvider";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

export const metadata = {
  title: "Closr — Conecta con tus creadores favoritos",
  description:
    "Descubre creadores, sigue su trabajo y únete a sus reuniones públicas o privadas.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AuthModalProvider>
              <div className="flex min-h-screen flex-col">
                <NavBar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
