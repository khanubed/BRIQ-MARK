import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContactState {
  fullName: string;
  email: string;
  company: string;
  targetMarket: "US" | "Canada" | "UAE" | "Other";
  budgetTier: "$10k-$25k" | "$25k-$50k" | "$50k-$100k" | "$100k+";
  servicesNeeded: string[];
  message: string;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string | null;
}

const initialState: ContactState = {
  fullName: "",
  email: "",
  company: "",
  targetMarket: "US",
  budgetTier: "$25k-$50k",
  servicesNeeded: [],
  message: "",
  status: "idle",
  errorMessage: null,
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setFormField: (
      state,
      action: PayloadAction<{
        field: keyof Omit<ContactState, "status" | "errorMessage">;
        value: any;
      }>
    ) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
    toggleServiceNeeded: (state, action: PayloadAction<string>) => {
      const idx = state.servicesNeeded.indexOf(action.payload);
      if (idx > -1) {
        state.servicesNeeded.splice(idx, 1);
      } else {
        state.servicesNeeded.push(action.payload);
      }
    },
    setStatus: (state, action: PayloadAction<ContactState["status"]>) => {
      state.status = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    resetContactForm: (state) => {
      state.fullName = "";
      state.email = "";
      state.company = "";
      state.targetMarket = "US";
      state.budgetTier = "$25k-$50k";
      state.servicesNeeded = [];
      state.message = "";
      state.status = "idle";
      state.errorMessage = null;
    },
  },
});

export const {
  setFormField,
  toggleServiceNeeded,
  setStatus,
  setErrorMessage,
  resetContactForm,
} = contactSlice.actions;

export default contactSlice.reducer;
