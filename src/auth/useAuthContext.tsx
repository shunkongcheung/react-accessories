import * as React from "react";

import useAuthProvider from "./useAuthProvider";

type ErrorLvl = "info" | "warn" | "error" | "none";

interface Error {
  msg: string;
  param?: string;
}

interface ParsedResult {
  result?: any;
  errors?: Array<Error>;
}

interface ParsedListResult extends ParsedResult {
  currentPage?: number;
  maxPage?: number;
}

interface AuthContextProviderProps<T extends object> {
  children: React.ReactNode;
  dataAttr?: string;
  defaultApiDomain?: string;
  defaultUser: T;
  defaultParseDetailResult?: (data: any) => ParsedResult;
  defaultParseEditResult?: (data: any) => ParsedResult;
  defaultParseListResult?: (data: any) => ParsedListResult;
  notify?: (msg: string, lvl: ErrorLvl) => any;
}

interface AuthContextShape<User extends object> {
  dataAttr: string;
  defaultApiDomain: string;
  defaultParseDetailResult: (data: any) => ParsedResult;
  defaultParseEditResult: (data: any) => ParsedResult;
  defaultParseListResult: (data: any) => ParsedListResult;
  handleTokenChange: (t: string) => void;
  token: string;
  isLogined: boolean;
  userInfo: User;
  notify: (msg: string, lvl: ErrorLvl) => any;
}

const AuthContext = React.createContext<AuthContextShape<any>>({
  dataAttr: "result",
  defaultApiDomain: "",
  defaultParseDetailResult: d => ({ result: d }),
  defaultParseEditResult: d => ({ result: d }),
  defaultParseListResult: d => ({ result: d, currentPage: 1, maxPage: 1 }),
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
    defaultParseDetailResult = d => ({ result: d }),
    defaultParseEditResult = d => ({ result: d }),
    defaultParseListResult = d => ({ result: d, currentPage: 1, maxPage: 1 }),
    children,
    defaultUser,
    notify = () => {}
  } = props;
  const auth = useAuthProvider<T>({ defaultUser });
  return (
    <AuthContext.Provider
      value={{
        ...auth,
        dataAttr,
        defaultApiDomain,
        defaultParseDetailResult,
        defaultParseEditResult,
        defaultParseListResult,
        notify
      }}
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
