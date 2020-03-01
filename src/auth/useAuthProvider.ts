import { useCallback, useEffect, useState, useMemo, useRef } from "react";

interface Props<T extends object> {
  defaultUser: T;
}

function useAuthProvider<T extends object>(props: Props<T>) {
  const { defaultUser } = props;
  const defaultUserRef = useRef(defaultUser);
  const tokenStorageName = useMemo(() => "aSdFlKjQeRpIouSadfLnZxv", []);

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState<T>(defaultUser);

  const parseJwt = useCallback(token => {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }, []);

  const setUserInfoAndExpireAtFromToken = useCallback(
    token => {
      const tokenInfo = parseJwt(token);
      setUserInfo({
        ...tokenInfo,
        dob: new Date(tokenInfo.dob),
        createdAt: new Date(tokenInfo.dob),
        astActive: new Date(tokenInfo.dob)
      });

      const date = new Date(0);
      date.setUTCSeconds(tokenInfo.exp);
    },
    [parseJwt]
  );

  const handleTokenChange = useCallback(
    (token: string) => {
      setToken(token);
      if (token) setUserInfoAndExpireAtFromToken(token);
      else setUserInfo(defaultUserRef.current);
      localStorage.setItem(tokenStorageName, token);
    },
    [tokenStorageName, setUserInfoAndExpireAtFromToken]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenStorageName);
    if (storedToken) handleTokenChange(storedToken);
  }, [tokenStorageName, handleTokenChange]);

  const isLogined = useMemo(() => !!token, [token]);

  return { handleTokenChange, isLogined, token, userInfo };
}

export default useAuthProvider;
