"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react.js";
import { persistor, store } from "redux/store/store";
import { Toaster } from "sonner";
import AuthProvider from "./AuthProvider";
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <Toaster position="top-center" richColors={true} />
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
