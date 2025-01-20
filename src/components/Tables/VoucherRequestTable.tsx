import {
  getAllVoucherRequest,
  getAllVoucherRequestByUserId,
  updateVoucherRequestByUserId,
} from "@/app/service/service";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { SearchOutlined } from "@mui/icons-material";
import { Voucher } from "@/types/voucher";
import { PurchaseHistory, User } from "@/types/voucher-request";

interface Tab {
  status: string;
  by: string;
}

const VoucherRequestTable: React.FC<Tab> = ({ status, by }) => {
  const userId = localStorage.getItem("userDId");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherRequests, setVoucherRequests] = useState<PurchaseHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User>();
  const [totalPages, setTotalPages] = useState();
  const [selectedVoucher, setSelectedVoucher] =
    useState<PurchaseHistory | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (by === "all") {
      fetchVoucherRequest(currentPage, value);
    } else {
      fetchVoucherByIdRequest(userId ? userId : "", currentPage, value);
    }
  };

  const fetchVoucherRequest = async (pageNo: number, searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVoucherRequest(
        status,
        pageNo,
        searchQuery ? searchQuery : "",
      ); // Pass page and limit to API
      if (data && data.status === 1) {
        setVoucherRequests(data.data);
        setTotalPages(data.pagination.totalPages);
        if (currentPage > data.pagination.currentPage) {
          setCurrentPage(data.pagination.currentPage);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err as string);
    }
  };

  const fetchVoucherByIdRequest = async (
    userId: string,
    pageNo: number,
    searchQuery?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVoucherRequestByUserId(
        status,
        userId,
        pageNo,
        searchQuery ? searchQuery : "",
      ); // Pass page and limit to API
      if (data && data.status === 1) {
        setUser(data.data.user);
        setVoucherRequests(data.data.purchases);
        setTotalPages(data.data.pagination.totalPages);
        if (currentPage > data.pagination.currentPage) {
          setCurrentPage(data.pagination.currentPage);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err as string);
    }
  };

  const updateVoucherRequest = async (userId: string, purchaseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateVoucherRequestByUserId(userId, purchaseId); // Pass page and limit to API
      if (data && data.status === 1) {
        if (by === "all") {
          fetchVoucherRequest(
            voucherRequests.length === 1 ? currentPage - 1 : currentPage,
          );
        } else {
          fetchVoucherByIdRequest(
            userId ? userId : "",
            voucherRequests.length === 1 ? currentPage - 1 : currentPage,
          );
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err as string);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (by === "all") {
      fetchVoucherRequest(currentPage);
    } else {
      fetchVoucherByIdRequest(userId ? userId : "", currentPage);
    }
  }, [currentPage, status, by]); // Re-fetch when page or itemsPerPage changes

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className=" mb-5">
            <form>
              <div className="relative">
                <button
                  disabled
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                >
                  <SearchOutlined />
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                  onChange={handleSearch}
                />
              </div>
            </form>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  User Name
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Voucher Name
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Request Date
                </th>
                {status === "Pending" && (
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center">
                    <Loader /> {/* The loader will span all 4 columns */}
                  </td>
                </tr>
              ) : (
                voucherRequests &&
                voucherRequests.length > 0 &&
                voucherRequests.map((data, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {by === "all" ? data?.name : user?.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {data?.title}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                          data?.status === "Active"
                            ? "bg-success text-success"
                            : "bg-warning text-warning"
                        }`}
                      >
                        {data?.status}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {
                          new Date(data?.purchaseDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                    </td>
                    {status === "Pending" && (
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          {/* <button className="hover:text-primary">
                          <RemoveRedEyeOutlined style={{ fontSize: 24 }} />
                        </button> */}
                          {/* <button
                          className="hover:text-primary"
                          // onClick={() => handleDeleteVoucher(voucher._id)}
                        >
                          <CloseOutlined style={{ fontSize: 24 }} />
                        </button>
                        <button
                          className="hover:text-primary"
                          // onClick={() => handleEditVoucher(voucher)}
                        >
                          <CheckOutlined style={{ fontSize: 24 }} />
                        </button> */}
                          <button
                            onClick={() =>
                              updateVoucherRequest(
                                by === "all"
                                  ? data?.userId
                                  : userId
                                    ? userId
                                    : "",
                                data?.purchaseId,
                              )
                            }
                            className="rounded bg-success bg-opacity-10 px-4 py-2 text-success hover:bg-green-200"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <svg
                                  className="mr-2 h-5 w-5 animate-spin text-success"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 12h4zm2 5.291A7.966 7.966 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Loading...
                              </div>
                            ) : (
                              "Activate"
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {voucherRequests && voucherRequests.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-black disabled:opacity-50 dark:text-white"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-black disabled:opacity-50 dark:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {voucherRequests && voucherRequests.length === 0 && (
          <div className="flex w-full justify-center p-10">
            No Voucher Request Found
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherRequestTable;
