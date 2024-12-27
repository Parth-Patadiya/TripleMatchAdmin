interface User {
  name: string;
  email: string;
  mobile: string;
}

interface UserActivity {
  signinCount: number;
  signoutCount: number;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  userActivity: UserActivity;
  status: number;
}
