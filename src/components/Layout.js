import Header from "./Header";

export default function Layout({ children, isMain }) {
  return (
    <div className="flex">
      <Header isMain={isMain}/>
      <div className="container grow w-5/6">
        <div>{children}</div>
      </div>
    </div>
  );
}
