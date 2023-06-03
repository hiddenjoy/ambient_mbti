import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Header />
      <div className="container grow w-5/6">
        <div>{children}</div>
      </div>
    </div>
  );
}
