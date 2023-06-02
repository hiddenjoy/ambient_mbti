import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="container h-full grow">
      <Header />
      <main className="px-15 py-3 h-full">{children}</main>
    </div>
  );
}
