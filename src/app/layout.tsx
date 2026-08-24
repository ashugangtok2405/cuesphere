import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ViewerProvider } from "@/components/shared/viewer-provider";
import { getViewer } from "@/lib/auth/get-viewer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CueSphere",
    template: "%s | CueSphere",
  },
  description:
    "The Complete Operating System for Snooker & Pool Clubs — tournaments, live scoring, registrations and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CueSphere",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0e12",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delay={150}>
            <ViewerProvider viewer={viewer}>
              {children}
              <Toaster theme="dark" position="top-right" richColors />
            </ViewerProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
