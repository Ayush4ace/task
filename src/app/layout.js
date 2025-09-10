import { Providers } from "@/lib/store/providers";
import "./globals.css";

export const metadata = {
  title: "Task Management System",
  description: "Drag & Drop Task Management with Optimistic UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
