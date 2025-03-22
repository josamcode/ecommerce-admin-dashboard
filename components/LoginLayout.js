// components/LoginLayout.js
export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body className="box-border font-sans bg-gray-200">
        <main className="flex justify-center items-center h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
