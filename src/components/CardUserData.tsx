import { Person } from "@mui/icons-material";
import React, { ReactNode } from "react";

interface CardUserDataProps {
  name: string;
  email: string;
  mobile: string;
}

const CardUserData: React.FC<CardUserDataProps> = ({ name, email, mobile }) => {
  return (
    <div className="grid grid-flow-col items-center rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex w-full flex-col items-start overflow-hidden">
        <div className="w-full">
          <h4 className="break-words text-title-md font-bold text-black dark:text-white">
            {name}
          </h4>
        </div>
        <div className="w-full">
          <span className="break-words text-sm font-medium">{email}</span>
        </div>
        <div className="w-full">
          <span className="break-words text-sm font-medium">{mobile}</span>
        </div>
      </div>
    </div>
  );
};

export default CardUserData;
