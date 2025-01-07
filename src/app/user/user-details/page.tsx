"use client";
import { getUserById } from "@/app/service/service";
import CardDataStats from "@/components/CardDataStats";
import CardUserData from "@/components/CardUserData";
import ChartOne from "@/components/Charts/ChartOne";
import ChartTwo from "@/components/Charts/ChartTwo";
import ChatCard from "@/components/Chat/ChatCard";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableOne from "@/components/Tables/TableOne";
import { LoginResponse } from "@/types/userById";
import {
  EmojiEventsOutlined,
  GppBadOutlined,
  LoginOutlined,
  LogoutOutlined,
  RestartAltOutlined,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const UserDetails: React.FC = () => {
  const userId = localStorage.getItem("userDId");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse>();

  const handleUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserById(userId ? userId : ""); // Pass page and limit to API
      if (data && data.status === 1) {
        setUser(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <DefaultLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
            User Details
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardUserData
              name={user?.user.name || ""}
              email={user?.user.email || ""}
              mobile={user?.user.mobile || ""}
            />
            <CardDataStats
              title="Login"
              total={user?.userActivity?.signinCount?.toString() || "0"}
              rate=""
            >
              <LoginOutlined />
            </CardDataStats>
            <CardDataStats
              title="Logout"
              total={user?.userActivity?.signoutCount?.toString() || "0"}
              rate=""
            >
              <LogoutOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-xl font-bold text-black dark:text-white">
            Play For Fun: {user?.userActivity?.playForFun?.count || "0"}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={user?.userActivity?.playForFun?.win.toString() || "0"}
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={user?.userActivity?.playForFun?.lost.toString() || "0"}
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={user?.userActivity?.playForFun?.restrat.toString() || "0"}
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-xl font-bold text-black dark:text-white">
            Play For Real
          </h2>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Easy: {user?.userActivity?.playForReal?.easy.count || "0"}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.easy?.win?.toString() || "0"
              }
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.easy?.lost?.toString() || "0"
              }
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.easy?.restrat?.toString() ||
                "0"
              }
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Medium: {user?.userActivity?.playForReal?.medium.count || "0"}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.medium?.win?.toString() || "0"
              }
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.medium?.lost?.toString() || "0"
              }
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.medium?.restrat?.toString() ||
                "0"
              }
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Hard: {user?.userActivity?.playForReal?.hard.count || "0"}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.hard?.win?.toString() || "0"
              }
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.hard?.lost?.toString() || "0"
              }
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.hard?.restrat?.toString() ||
                "0"
              }
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>

          {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <ChartOne />
            <ChartTwo />
            <ChartThree />
            <MapOne />
            <div className="col-span-12 xl:col-span-8">
              <TableOne />
            </div>
            <ChatCard />
          </div> */}
        </>
      )}
    </DefaultLayout>
  );
};

export default UserDetails;
