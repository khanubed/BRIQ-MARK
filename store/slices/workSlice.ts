import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WorkState {
  selectedIndustry: string;
  selectedCapability: string;
  selectedMarket: "all" | "US" | "Canada" | "UAE";
  activeCaseStudySlug: string | null;
  searchQuery: string;
}

const initialState: WorkState = {
  selectedIndustry: "all",
  selectedCapability: "all",
  selectedMarket: "all",
  activeCaseStudySlug: null,
  searchQuery: "",
};

export const workSlice = createSlice({
  name: "work",
  initialState,
  reducers: {
    setSelectedIndustry: (state, action: PayloadAction<string>) => {
      state.selectedIndustry = action.payload;
    },
    setSelectedCapability: (state, action: PayloadAction<string>) => {
      state.selectedCapability = action.payload;
    },
    setSelectedMarket: (
      state,
      action: PayloadAction<"all" | "US" | "Canada" | "UAE">
    ) => {
      state.selectedMarket = action.payload;
    },
    setActiveCaseStudySlug: (state, action: PayloadAction<string | null>) => {
      state.activeCaseStudySlug = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.selectedIndustry = "all";
      state.selectedCapability = "all";
      state.selectedMarket = "all";
      state.searchQuery = "";
    },
  },
});

export const {
  setSelectedIndustry,
  setSelectedCapability,
  setSelectedMarket,
  setActiveCaseStudySlug,
  setSearchQuery,
  resetFilters,
} = workSlice.actions;

export default workSlice.reducer;
