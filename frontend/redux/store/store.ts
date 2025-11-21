import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { api } from "../api/appSlice";
import authReducer from "../features/auth/auth.slice";
import postReducer from "../features/post/post.slice";

import reduxStorage from "redux-persist/lib/storage";

const getStorage = () => {
  // Check if we are running in a browser environment
  if (typeof window !== "undefined") {
    // Dynamically import local/session storage on the client
    return reduxStorage;
  }
  // On the server, return a 'no-op' storage that does nothing
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: any) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  };
};

const storage = getStorage();
const persistConfig = {
  key: "root",
  storage,
};
const persistAuthReducer = persistReducer(
  { ...persistConfig, key: "auth" },
  authReducer
);

// Configure store
const store = configureStore({
  reducer: {
    auth: persistAuthReducer,
    post: postReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Configure persistor
const persistor = persistStore(store);

// Export types and store/persistor
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { persistor, store };
