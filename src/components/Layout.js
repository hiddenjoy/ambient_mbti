import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="container">
      <Header />
      <main className="px-15 py-5 h-full">{children}</main>
    </div>
  );
}
