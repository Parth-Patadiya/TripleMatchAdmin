interface UserActivity {
  signIn: Array<{
    deviceName: string;
    deviceModel: string;
    operatingSystem: string;
    processorType: string;
    appVersion: string;
    date: string;
  }>;
  signOut: Array<{
    deviceName: string;
    deviceModel: string;
    operatingSystem: string;
    processorType: string;
    appVersion: string;
    date: string;
  }>;
  playForFun: {
    win: Array<{
      result: string;
      deviceName: string;
      deviceModel: string;
      operatingSystem: string;
      processorType: string;
      appVersion: string;
      date: string;
    }>;
    lost: Array<{
      result: string;
      deviceName: string;
      deviceModel: string;
      operatingSystem: string;
      processorType: string;
      appVersion: string;
      date: string;
    }>;
    restart: Array<{
      result: string;
      deviceName: string;
      deviceModel: string;
      operatingSystem: string;
      processorType: string;
      appVersion: string;
      date: string;
    }>;
  };
  playForReal: {
    easy: {
      win: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      lost: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      restart: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
    };
    medium: {
      win: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      lost: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      restart: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
    };
    hard: {
      win: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      lost: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
      restart: Array<{
        level: string;
        result: string;
        deviceName: string;
        deviceModel: string;
        operatingSystem: string;
        processorType: string;
        appVersion: string;
        date: string;
      }>;
    };
  };
}

interface User {
  name: string;
  email: string;
  mobile: string;
  amountPaid: number;
  coins: number;
  winAmount: number;
}

export interface LoginResponse {
  message: string;
  id: string;
  user: User;
  userActivity: UserActivity;
  status: number;
}
