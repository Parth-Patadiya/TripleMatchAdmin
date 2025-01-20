import { useState } from "react";
import VoucherRequestTable from "../Tables/VoucherRequestTable";

interface Tab {
  status: string;
}
interface show {
  by: string;
}

const tabs: Tab[] = [{ status: "Pending" }, { status: "Active" }];

const Tabs: React.FC<show> = ({ by }) => {
  const [activeTab, setActiveTab] = useState<string>("Pending");

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            className={`px-6 py-4 text-gray-600 hover:text-blue-600 focus:outline-none ${
              activeTab === tab.status
                ? "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab(tab.status)}
          >
            {tab.status}
          </button>
        ))}
      </div>
      <div>
        <VoucherRequestTable status={activeTab} by={by} />
      </div>
    </div>
  );
};

export default Tabs;
