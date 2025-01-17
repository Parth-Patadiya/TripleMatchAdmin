import { CloseOutlined } from "@mui/icons-material";
import { FC, useEffect, useRef } from "react";

interface Device {
  deviceName: string;
  deviceModel: string;
  operatingSystem: string;
  processorType: string;
  appVersion: string;
  date: string;
}

interface UserActivityPopupProps {
  deviceData: Array<Device> | undefined;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const UserActivityPopup: FC<UserActivityPopupProps> = ({
  deviceData,
  isOpen,
  title,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={popupRef}
        className="z-9999 h-[80%] w-[90%] rounded-sm border border-stroke bg-white px-2 py-2 shadow-default dark:border-strokedark dark:bg-boxdark lg:w-[80%]"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            {title} Activity
          </h4>
          <button
            onClick={onClose}
            className="text-black dark:text-white"
            aria-label="Close"
          >
            <CloseOutlined />
          </button>
        </div>
        <div className="h-[90%] max-w-full overflow-x-auto overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="sticky top-0">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                  Device Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Device Model
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Operating System
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Processor Type
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  App Version
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Date Time
                </th>
              </tr>
            </thead>
            <tbody>
              {deviceData &&
                deviceData.map((device, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {device.deviceName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {device.deviceModel}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {device.operatingSystem}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {device.processorType}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {device.appVersion}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(device.date)}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {deviceData && deviceData.length === 0 && (
            <div className="flex w-full justify-center p-10">
              No Details Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityPopup;
