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
} from "@mui/icons-material";

const UserTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedMobile, setUpdatedMobile] = useState("");

  const handleUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(currentPage); // Pass page and limit to API
      if (data && data.status === 1) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
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
        handleUser();
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
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setUpdatedMobile(user.mobile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (selectedUser) {
      // Simulate an API call to update user
      // setLoading(true);
      // setError(null);
      try {
        const data = await editUserById({
          userId: selectedUser._id,
          name: updatedName,
          email: updatedEmail,
          mobile: updatedMobile,
        }); // Pass page and limit to API
        if (data && data.status === 1) {
          handleUser();
          // setLoading(false);
        } else {
          // setLoading(false);
          setError(data.message);
        }
      } catch (err) {
        // setLoading(false);
        setError(err as string);
      }
      closeModal();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleUser();
  }, [currentPage]); // Re-fetch when page or itemsPerPage changes

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
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
              {loading ? (
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
                        <button className="hover:text-primary">
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
              <h2 className="mb-4 text-xl font-bold text-black">Update User</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded border p-2"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border p-2"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Mobile
                </label>
                <input
                  type="text"
                  className="w-full rounded border p-2"
                  value={updatedMobile}
                  onChange={(e) => setUpdatedMobile(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
