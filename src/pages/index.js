import Link from "next/link";
import Main from "./main-page";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
