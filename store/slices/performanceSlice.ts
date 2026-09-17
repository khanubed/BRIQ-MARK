import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PerformanceState {
  webglSupported: boolean;
  isLowPowerDevice: boolean;
  heroInView: boolean;
  fps: number;
}

const initialState: PerformanceState = {
  webglSupported: true,
  isLowPowerDevice: false,
  heroInView: true,
  fps: 60,
};

export const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    setWebglSupported: (state, action: PayloadAction<boolean>) => {
      state.webglSupported = action.payload;
    },
    setIsLowPowerDevice: (state, action: PayloadAction<boolean>) => {
      state.isLowPowerDevice = action.payload;
    },
    setHeroInView: (state, action: PayloadAction<boolean>) => {
      state.heroInView = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
  },
});

export const {
  setWebglSupported,
  setIsLowPowerDevice,
  setHeroInView,
  setFps,
} = performanceSlice.actions;

export default performanceSlice.reducer;
