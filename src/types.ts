export type Screen = "registration" | "otp" | "mpin" | "home";

export interface Account {
  name: string;
  phone: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
}
