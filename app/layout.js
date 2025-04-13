// layout.js
"use client";

import { useEffect } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/lib/AuthContext";
import withAuth from "@/utils/withAuth";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const title = children?.type?.name || "Admin Dashboard";
    document.title = title;

    console.log(title);
  }, [children]);

  const AuthenticatedChildren = withAuth(() => children);

  return (
    <html lang="en">
      <body className="box-border font-sans" suppressHydrationWarning>
        <AuthProvider>
          <SidebarProvider>
            {!isLoginPage ? (
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col box-border overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-auto p-6 bg-gray-100 shadow-inner rounded-tl-3xl rounded-tr-3xl box-border">
                    <AuthenticatedChildren />
                  </main>
                </div>
              </div>
            ) : (
              <main className="flex justify-center items-center h-screen bg-gray-200">
                {children}
              </main>
            )}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
