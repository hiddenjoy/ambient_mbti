import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Main from "./main-page";
import TodayQuestion from "./todayQuestion";
import Footer from "../components/Footer";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <Layout>
          <Main />
        </Layout>
        <Footer />
      </div>
    </>
  );
}
