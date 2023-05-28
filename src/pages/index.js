import Link from "next/link";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import Main from "./main-page";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  // const router = useRouter();
  // const { data } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     router.replace("/auth/signin");
  //   },
  // });

  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
