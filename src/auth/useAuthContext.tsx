import * as React from "react";

import useAuthProvider from "./useAuthProvider";

interface AuthContextProviderProps<T extends object> {
  children: React.ReactNode;
  defaultUser: T;
}

interface AuthContextShape<User extends object> {
  handleTokenChange: (t: string) => void;
  token: string;
  isLogined: boolean;
  userInfo: User;
}

const AuthContext = React.createContext<AuthContextShape<any>>({
  handleTokenChange: () => {},
  token: "",
  isLogined: false,
  userInfo: {}
});

function AuthContextProviderUnMemo<T extends object>(
  props: AuthContextProviderProps<T>
) {
  const { children, defaultUser } = props;
  const auth = useAuthProvider<T>({ defaultUser });
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const AuthContextProvider = React.memo(AuthContextProviderUnMemo);

function useAuthContext<T extends object>() {
  return React.useContext<AuthContextShape<T>>(AuthContext);
}

export { AuthContextProvider };
export default useAuthContext;
