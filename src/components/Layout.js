import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex h-full">
      <Header />
      <div className="container grow w-5/6 h-full">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
