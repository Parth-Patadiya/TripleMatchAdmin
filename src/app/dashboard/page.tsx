"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ECommerce from "@/components/Dashboard/E-commerce";
import { withAuth } from "../auth/helper/withAuth";

const Dashboard = () => {
  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
};

export default withAuth(Dashboard);
