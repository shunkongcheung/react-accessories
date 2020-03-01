import * as React from "react";

import useAuthProvider from "./useAuthProvider";

type ErrorLvl = "info" | "warn" | "error" | "none";

interface AuthContextProviderProps<T extends object> {
  children: React.ReactNode;
  dataAttr?: string;
  defaultApiDomain?: string;
  defaultUser: T;
  notify?: (msg: string, lvl: ErrorLvl) => any;
}

interface AuthContextShape<User extends object> {
  dataAttr: string;
  defaultApiDomain: string;
  handleTokenChange: (t: string) => void;
  token: string;
  isLogined: boolean;
  userInfo: User;
  notify: (msg: string, lvl: ErrorLvl) => any;
}

const AuthContext = React.createContext<AuthContextShape<any>>({
  dataAttr: "result",
  defaultApiDomain: "",
  handleTokenChange: () => {},
  notify: () => {},
  token: "",
  isLogined: false,
  userInfo: {}
});

function AuthContextProviderUnMemo<T extends object>(
  props: AuthContextProviderProps<T>
) {
  const {
    dataAttr = "result",
    defaultApiDomain = "",
    children,
    defaultUser,
    notify = () => {}
  } = props;
  const auth = useAuthProvider<T>({ defaultUser });
  return (
    <AuthContext.Provider
      value={{ ...auth, dataAttr, defaultApiDomain, notify }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const AuthContextProvider = React.memo(AuthContextProviderUnMemo);

function useAuthContext<T extends object>() {
  return React.useContext<AuthContextShape<T>>(AuthContext);
}

export { AuthContextProvider };
export default useAuthContext;
