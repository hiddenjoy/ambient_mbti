import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Main from "./main-page";
import Footer from "../components/Footer";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  
  return (
    <>
      <Layout>
        <Main />
      </Layout>
      <Footer />
    </>
  );
}
