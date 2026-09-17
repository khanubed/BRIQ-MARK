import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import themeReducer from "./slices/themeSlice";
import workReducer from "./slices/workSlice";
import contactReducer from "./slices/contactSlice";
import performanceReducer from "./slices/performanceSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      theme: themeReducer,
      work: workReducer,
      contact: contactReducer,
      performance: performanceReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
