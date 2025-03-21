"use client";
import { withAuth } from "@/app/auth/helper/withAuth";
import { getUserById } from "@/app/service/service";
import CardDataStats from "@/components/CardDataStats";
import CardUserData from "@/components/CardUserData";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Tabs from "@/components/Tabs/Tabs";
import { LoginResponse } from "@/types/userById";
import {
  EmojiEventsOutlined,
  GppBadOutlined,
  LoginOutlined,
  LogoutOutlined,
  PaidOutlined,
  RestartAltOutlined,
  SportsGolfOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";

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
              total={user?.userActivity?.signIn?.length?.toString() || "0"}
              deviceData={user?.userActivity?.signIn}
              rate=""
            >
              <LoginOutlined />
            </CardDataStats>
            <CardDataStats
              title="Logout"
              total={user?.userActivity?.signOut?.length?.toString() || "0"}
              deviceData={user?.userActivity?.signOut}
              rate=""
            >
              <LogoutOutlined />
            </CardDataStats>
          </div>
          <div className=" mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Coins"
              total={user?.user?.coins?.toString().toString() || "0"}
              deviceData={[]}
              rate=""
            >
              <SportsGolfOutlined />
            </CardDataStats>
            <CardDataStats
              title="AmountPaid"
              total={user?.user?.amountPaid?.toString() || "0"}
              deviceData={[]}
              rate=""
            >
              <PaidOutlined />
            </CardDataStats>
            <CardDataStats
              title="AmountWin"
              total={user?.user?.winAmount?.toString() || "0"}
              deviceData={[]}
              rate=""
            >
              <PaidOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-xl font-bold text-black dark:text-white">
            Play For Fun:{" "}
            {(user?.userActivity?.playForFun?.win?.length ?? 0) +
              (user?.userActivity?.playForFun?.lost?.length ?? 0) +
              (user?.userActivity?.playForFun?.restart?.length ?? 0)}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForFun?.win?.length.toString() || "0"
              }
              deviceData={user?.userActivity?.playForFun?.win}
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForFun?.lost?.length.toString() || "0"
              }
              deviceData={user?.userActivity?.playForFun?.lost}
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForFun?.restart?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForFun?.restart}
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-xl font-bold text-black dark:text-white">
            Play For Real
          </h2>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Good:{" "}
            {(user?.userActivity?.playForReal?.good?.win?.length ?? 0) +
              (user?.userActivity?.playForReal?.good?.lost?.length ?? 0) +
              (user?.userActivity?.playForReal?.good?.restart?.length ?? 0)}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.good?.win?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.good?.win}
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.good?.lost?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.good?.lost}
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.good?.restart?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.good?.restart}
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Rare:{" "}
            {(user?.userActivity?.playForReal?.rare?.win?.length ?? 0) +
              (user?.userActivity?.playForReal?.rare?.lost?.length ?? 0) +
              (user?.userActivity?.playForReal?.rare?.restart?.length ?? 0)}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.rare?.win?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.rare?.win}
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.rare?.lost?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.rare?.lost}
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.rare?.restart?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.rare?.restart}
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Epic:{" "}
            {(user?.userActivity?.playForReal?.epic?.win?.length ?? 0) +
              (user?.userActivity?.playForReal?.epic?.lost?.length ?? 0) +
              (user?.userActivity?.playForReal?.epic?.restart?.length ?? 0)}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Win"
              total={
                user?.userActivity?.playForReal?.epic?.win?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.epic?.win}
              rate=""
            >
              <EmojiEventsOutlined />
            </CardDataStats>
            <CardDataStats
              title="Lost"
              total={
                user?.userActivity?.playForReal?.epic?.lost?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.epic?.lost}
              rate=""
            >
              <GppBadOutlined />
            </CardDataStats>
            <CardDataStats
              title="Restart"
              total={
                user?.userActivity?.playForReal?.epic?.restart?.length.toString() ||
                "0"
              }
              deviceData={user?.userActivity?.playForReal?.epic?.restart}
              rate=""
            >
              <RestartAltOutlined />
            </CardDataStats>
          </div>
          <h2 className="my-4 text-lg font-bold text-black dark:text-white">
            Voucher Request
          </h2>
          <Tabs by={"ID"} />

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

export default withAuth(UserDetails);
