import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UpdateUserPopupProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const UpdateUserPopup: React.FC<UpdateUserPopupProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, name, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Update User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserPopup;
