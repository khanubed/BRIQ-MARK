import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
  prefersReducedMotion: boolean;
  soundEnabled: boolean;
  accentMode: "gold" | "cyan";
}

const initialState: ThemeState = {
  prefersReducedMotion: false,
  soundEnabled: false,
  accentMode: "gold",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setPrefersReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.prefersReducedMotion = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setAccentMode: (state, action: PayloadAction<"gold" | "cyan">) => {
      state.accentMode = action.payload;
    },
  },
});

export const { setPrefersReducedMotion, toggleSound, setAccentMode } =
  themeSlice.actions;

export default themeSlice.reducer;
