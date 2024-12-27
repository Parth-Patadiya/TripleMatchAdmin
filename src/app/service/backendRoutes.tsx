const BaseURL = "/api/auth/";

//Admin Routes
export const adminSignInRoute = BaseURL + "admin/signin";

//User Routes
export const getAllUserRoute = BaseURL + "user/getUsersByPageNo";
export const getUserByIDRoute = BaseURL + "user/getUserById";
export const deleteUserRoute = BaseURL + "user/deleteUserById";
export const editUserRoute = BaseURL + "user/updateUserById";
export const validateTokenRoute = BaseURL + "user/validateResetToken";
export const forgotUserPasswordRoute = BaseURL + "user/updatePassword";

//Voucher Routes
export const addVoucherRoute = BaseURL + "voucher/createVoucher";
export const getAllVoucherRoute = BaseURL + "voucher/getAllVouchersByPageNo";
export const updateVoucherRoute = BaseURL + "voucher/updateVoucher";
export const deleteVoucherRoute = BaseURL + "voucher/deleteVoucher";
