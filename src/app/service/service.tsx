import {
  addVoucherRoute,
  adminSignInRoute,
  deleteUserRoute,
  deleteVoucherRoute,
  editUserRoute,
  forgotUserPasswordRoute,
  getAdminByIdRoute,
  getAllUserRoute,
  getAllVoucherRequestByUserIdRoute,
  getAllVoucherRequestRoute,
  getAllVoucherRoute,
  getUserByIDRoute,
  updateAdminByIdRoute,
  updateVoucherRequestByUserIdRoute,
  updateVoucherRoute,
  validateTokenRoute,
} from "./backendRoutes";

export const adminSignIn = async (email: string, password: string) => {
  try {
    const response = await fetch(adminSignInRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("adminSignIn" + " Error" + error);
  }
  return null;
};

export const getAdminById = async (adminId: string) => {
  try {
    const response = await fetch(getAdminByIdRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getAdminById" + " Error" + error);
  }
  return null;
};

export const updateAdminById = async (admin: object) => {
  try {
    const response = await fetch(updateAdminByIdRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...admin,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("editUserById" + " Error" + error);
  }
  return null;
};

export const getAllUsers = async (pageNumber: number, searchQuery: string) => {
  try {
    const response = await fetch(getAllUserRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
        searchQuery,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getAllUsers" + " Error" + error);
  }
  return null;
};

export const getUserById = async (userId: string) => {
  try {
    const response = await fetch(getUserByIDRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getUserById" + " Error" + error);
  }
  return null;
};

export const deleteUserById = async (userId: string) => {
  try {
    const response = await fetch(deleteUserRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("deleteUserById" + " Error" + error);
  }
  return null;
};

export const editUserById = async (user: object) => {
  try {
    const response = await fetch(editUserRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("editUserById" + " Error" + error);
  }
  return null;
};

export const validateResetToken = async (user: object) => {
  try {
    const response = await fetch(validateTokenRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("validateResetToken" + " Error" + error);
  }
  return null;
};

export const forgotUserPassword = async (user: object) => {
  try {
    const response = await fetch(forgotUserPasswordRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("forgotUserPassword" + " Error" + error);
  }
  return null;
};

export const createVoucher = async (voucher: FormData) => {
  try {
    const response = await fetch(addVoucherRoute, {
      method: "POST",
      body: voucher,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};

export const getAllVoucher = async (
  pageNumber: number,
  searchQuery: string,
) => {
  try {
    const response = await fetch(getAllVoucherRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
        searchQuery,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};

export const updateVoucher = async (voucher: FormData) => {
  console.error("createVoucher" + JSON.stringify(voucher));
  try {
    const response = await fetch(updateVoucherRoute, {
      method: "POST",
      body: voucher,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};

export const deleteVoucherById = async (voucherId: string) => {
  try {
    const response = await fetch(deleteVoucherRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voucherId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("deleteUserById" + " Error" + error);
  }
  return null;
};

export const getAllVoucherRequest = async (
  status: string,
  pageNumber: number,
  searchQuery: string,
) => {
  try {
    const response = await fetch(getAllVoucherRequestRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
        searchQuery,
        status,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};

export const getAllVoucherRequestByUserId = async (
  status: string,
  userId: string,
  pageNumber: number,
  searchQuery: string,
) => {
  try {
    const response = await fetch(getAllVoucherRequestByUserIdRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        userId,
        pageNumber,
        searchQuery,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};

export const updateVoucherRequestByUserId = async (
  userId: string,
  purchaseId: string,
) => {
  try {
    const response = await fetch(updateVoucherRequestByUserIdRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        purchaseId,
        newStatus: "Active",
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createVoucher" + " Error" + error);
  }
  return null;
};
