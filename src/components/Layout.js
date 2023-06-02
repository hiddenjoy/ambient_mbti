import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Header />
      <div className="container grow h-full">
        <main className="py-3 h-full">{children}</main>
      </div>
    </div>
  );
}
