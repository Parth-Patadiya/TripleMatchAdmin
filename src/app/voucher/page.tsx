"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { withAuth } from "../auth/helper/withAuth";
import VoucherTable from "@/components/Tables/VoucherTable";
import { AddOutlined } from "@mui/icons-material";
import { useState } from "react";
import { createVoucher } from "../service/service";

const Voucher = () => {
  const formData = new FormData();
  const [formValues, setFormValues] = useState<Record<string, string>>({
    title: "",
    des: "",
    validTill: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    des: "",
    validTill: "",
    amount: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedImage, setUpdatedImage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.title) {
      newErrors.title = "Title is required";
    }
    if (!formValues.des) {
      newErrors.des = "Description is required";
    }
    if (!formValues.validTill) {
      newErrors.validTill = "Date is required";
    }
    if (!formValues.amount) {
      newErrors.amount = "Amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addVoucher();
    }
  };

  const addVoucher = async () => {
    setLoading(true);
    setError(null);
    try {
      formData.set("title", formValues.title);
      formData.set("description", formValues.des);
      formData.set("validTill", formValues.validTill);
      formData.set("amount", formValues.amount);
      image && formData.set("image", image);
      const data = await createVoucher(formData); // Pass page and limit to API
      if (data && data.status === 1) {
        setReload(true);
        closeModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="sm:justify-items-end">
        <button
          onClick={openModal}
          className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-4 text-sm font-medium text-white transition hover:bg-opacity-90 sm:w-50"
        >
          <AddOutlined style={{ fontSize: 24 }} />
          Add Coupon
        </button>
      </div>
      <VoucherTable load={reload} />

      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="z-9999 w-[70%] rounded bg-white shadow-lg dark:bg-boxdark lg:w-[50%]">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h2 className="font-medium text-black dark:text-white">
                Add Voucher
              </h2>
            </div>
            <div className="overflow-auto p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Title"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formValues.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
                  </label>
                  <input
                    name="des"
                    type="text"
                    placeholder="Description"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formValues.des}
                    onChange={handleChange}
                  />
                  {errors.des && (
                    <p className="mt-1 text-sm text-red-500">{errors.des}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image
                  </label>
                  <div className=" mt-4 flex items-center space-x-4">
                    {updatedImage && (
                      <img
                        src={updatedImage}
                        alt="Voucher"
                        className="h-15 w-15 rounded-lg object-cover"
                      />
                    )}
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUpdatedImage(URL.createObjectURL(file));
                          setImage(file);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Valid Till
                  </label>
                  <input
                    name="validTill"
                    type="date"
                    onKeyDown={(e) => e.preventDefault()}
                    min={new Date().toISOString().split("T")[0]}
                    value={
                      formValues.validTill &&
                      new Date(formValues.validTill).toISOString().split("T")[0]
                    }
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded border border-stroke bg-gray p-2 px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                  {errors.validTill && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.validTill}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formValues.amount}
                    onChange={handleChange}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
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
                      "Add"
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
        </div>
      )}
    </DefaultLayout>
  );
};

export default withAuth(Voucher);
