"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { withAuth } from "../auth/helper/withAuth";
import UserTable from "@/components/Tables/UserTable";

const User = () => {
  return (
    <DefaultLayout>
      <UserTable />
    </DefaultLayout>
  );
};

export default withAuth(User);
