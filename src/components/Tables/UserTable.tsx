import {
  deleteUserById,
  editUserById,
  getAllUsers,
} from "@/app/service/service";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { User } from "@/types/user";
import {
  RemoveRedEyeOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const UserTable = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    mobile: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const handleNavigation = (userId: string) => {
    localStorage.setItem("userDId", userId);
    router.push("/user/user-details");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleUser(currentPage, value);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.name) {
      newErrors.name = "Name is required";
    }
    if (!formValues.email) {
      newErrors.email = "Email is required";
    }
    if (!formValues.mobile) {
      newErrors.mobile = "Mobile is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      handleSaveChanges();
    }
  };

  const handleUser = async (pageNo: number, searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(pageNo, searchQuery ? searchQuery : ""); // Pass page and limit to API
      if (data && data.status === 1) {
        setUsers(data.users);
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

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deleteUserById(userId); // Pass page and limit to API
      if (data && data.status === 1) {
        handleUser(users.length === 1 ? currentPage - 1 : currentPage);
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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormValues((prev) => ({ ...prev, name: user.name }));
    setFormValues((prev) => ({ ...prev, email: user.email }));
    setFormValues((prev) => ({ ...prev, mobile: user.mobile }));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (selectedUser) {
      // Simulate an API call to update user
      setLoading(true);
      setError(null);
      try {
        const data = await editUserById({
          userId: selectedUser._id,
          name: formValues.name,
          email: formValues.email,
          mobile: formValues.mobile,
        }); // Pass page and limit to API
        if (data && data.status === 1) {
          handleUser(currentPage);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
      closeModal();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleUser(currentPage);
  }, [currentPage]); // Re-fetch when page or itemsPerPage changes

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
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Mobile
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
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
                users &&
                users.length > 0 &&
                users.map((user, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.name}
                      </h5>
                      <p className="text-sm">$ 0</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.mobile}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => handleNavigation(user._id)}
                        >
                          <RemoveRedEyeOutlined style={{ fontSize: 24 }} />
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <DeleteOutlined style={{ fontSize: 24 }} />
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditOutlined style={{ fontSize: 24 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {users && users.length > 0 && (
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

        {users && users.length === 0 && (
          <div className="flex w-full justify-center p-10">No User Found</div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50">
            <div className="z-9999 w-[90%] rounded bg-white p-6 shadow-lg sm:w-[50%]">
              <form onSubmit={handleSubmit}>
                <h2 className="mb-4 text-xl font-bold text-black">
                  Update User
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full rounded border p-2"
                    value={formValues.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">
                    Email
                  </label>
                  <input
                    name="email"
                    type="text"
                    className="w-full rounded border p-2"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black">
                    Mobile
                  </label>
                  <input
                    name="mobile"
                    type="tel"
                    className="w-full rounded border p-2"
                    value={formValues.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="mr-2 h-5 w-5 animate-spin text-white"
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
                      "Updete"
                    )}
                  </button>
                </div>
              </form>

              {error ? (
                <div className=" mt-10 flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                  <div className="mr-5 flex h-7 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                        fill="#ffffff"
                        stroke="#ffffff"
                      ></path>
                    </svg>
                  </div>
                  <div className="w-full">
                    <h5 className="font-semibold text-[#B45454]">{error}</h5>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
