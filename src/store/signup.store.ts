import { create } from "zustand";

interface SignupFormData {
  fullName: string;
  birthday: string; // ISO date string: "YYYY-MM-DD"
  email: string;
  password: string;
  pin: string;
}

interface SignupStore {
  formData: SignupFormData;
  setStep1: (fullName: string, birthday: string) => void;
  setStep2: (email: string, password: string) => void;
  setStep3: (pin: string) => void;
  reset: () => void;
}

const INITIAL_FORM_DATA: SignupFormData = {
  fullName: "",
  birthday: "",
  email: "",
  password: "",
  pin: "",
};

export const useSignupStore = create<SignupStore>()((set) => ({
  formData: INITIAL_FORM_DATA,

  setStep1: (fullName, birthday) => {
    set((state) => ({ formData: { ...state.formData, fullName, birthday } }));
  },
  setStep2: (email, password) => {
    set((state) => ({ formData: { ...state.formData, email, password } }));
  },
  setStep3: (pin) => {
    set((state) => ({ formData: { ...state.formData, pin } }));
  },

  reset: () => {
    set({ formData: INITIAL_FORM_DATA });
  },
}));
