export interface Login {
  UserName: string;
  UserPassword: string;
}
export interface LoginResponse {
  token: string;
}
export interface Login1Response {
  message: string; // e.g., "Login Successful"
  result: boolean; // true if login was successful
  data: {
    custId: number; // Customer ID
    name: string; // User's name
    mobileNo: string; // User's mobile number
    password: string; // User's password (usually sensitive, might not need to store)
  } | null;
}

export interface User {
  custId: number;
  name: string;
  mobileNo: number;
}
