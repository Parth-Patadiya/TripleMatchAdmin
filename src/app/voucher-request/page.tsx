"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { withAuth } from "../auth/helper/withAuth";
import { useState } from "react";
import VoucherRequestTable from "@/components/Tables/VoucherRequestTable";
import Tabs from "@/components/Tabs/Tabs";

const VoucherRequest = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <DefaultLayout>
      <Tabs by={"all"} />
    </DefaultLayout>
  );
};

export default withAuth(VoucherRequest);
