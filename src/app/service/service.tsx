import {
  adminSignInRoute,
  deleteUserRoute,
  editUserRoute,
  getAllUserRoute,
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

export const getAllUsers = async (pageNumber: number) => {
  try {
    const response = await fetch(getAllUserRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getAllUsers" + " Error" + error);
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
