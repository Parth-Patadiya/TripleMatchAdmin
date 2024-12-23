const BaseURL = "/api/auth/";

//Admin Routes
export const adminSignInRoute = BaseURL + "admin/signin";

//User Routes
export const getAllUserRoute = BaseURL + "user/getUsersByPageNo";
export const deleteUserRoute = BaseURL + "user/deleteUserById";
export const editUserRoute = BaseURL + "user/updateUserById";
export const validateTokenRoute = BaseURL + "user/validateResetToken";
export const forgotUserPasswordRoute = BaseURL + "user/updatePassword";
