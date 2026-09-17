import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  isMobileMenuOpen: boolean;
  cursorVariant: "default" | "hover" | "project" | "text" | "hidden";
  isContactModalOpen: boolean;
  activeSection: string;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  cursorVariant: "default",
  isContactModalOpen: false,
  activeSection: "hero",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    setCursorVariant: (state, action: PayloadAction<UIState["cursorVariant"]>) => {
      state.cursorVariant = action.payload;
    },
    setContactModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isContactModalOpen = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  setCursorVariant,
  setContactModalOpen,
  setActiveSection,
} = uiSlice.actions;

export default uiSlice.reducer;
