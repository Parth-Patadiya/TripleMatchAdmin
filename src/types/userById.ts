interface User {
  name: string;
  email: string;
  mobile: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  userActivity: UserActivity;
  status: number;
}

type PlayStats = {
  count: number;
  win: number;
  lost: number;
  restrat: number;
};

type PlayForRealStats = {
  easy: PlayStats;
  medium: PlayStats;
  hard: PlayStats;
};

type UserActivity = {
  signinCount: number;
  signoutCount: number;
  playForFun: PlayStats;
  playForReal: PlayForRealStats;
};

