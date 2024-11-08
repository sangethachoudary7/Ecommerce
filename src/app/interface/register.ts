export interface Registration {
  Name: string;
  MobileNo: string;
  Password: string;
}
export interface RegistrationResponse {
  message: string;
  result: boolean;
  data: {
    CustId: number;
    Name: string;
    MobileNo: string;
  } | null;
}
