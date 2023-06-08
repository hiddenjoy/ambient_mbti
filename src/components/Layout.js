import Header from "./Header";

export default function Layout({ children, whichPage }) {
  return (
    <div className="flex">
      <Header whichPage={whichPage}/>
      <div className="container grow w-5/6">
        <div>{children}</div>
      </div>
    </div>
  );
}
