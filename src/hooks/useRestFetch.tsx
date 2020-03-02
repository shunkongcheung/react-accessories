import { useCallback } from "react";
import { stringify } from "query-string";

import { useAuthContext } from "../auth";

type ErrorLvl = "info" | "warn" | "error" | "none";

interface FetchResponse {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}

interface Params {
  data?: object;
  method?: Method;
  queryParams?: object;
  isAuthenticated?: boolean;
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ResponseShape<ResultShape extends object> {
  result: ResultShape;
  errors?: Array<{ msg: string; param?: string }>;
}

function useRestFetch<ResultShape extends object>(
  errorLvl: ErrorLvl = "error"
) {
  const { defaultApiDomain, token, notify: notifyOri } = useAuthContext();

  const notify = useCallback((msg: string | object) => {
    if (typeof msg === "object" && msg) msg = JSON.stringify(msg, null, 4);
    notifyOri(msg, errorLvl);
  }, []);

  const getAuthorization = useCallback(
    (isAuthenticated: boolean) => {
      if (!isAuthenticated) return "";
      if (!token) {
        console.warn("User should login before entering this page");
        return "";
      }
      return `Bearer ${token}`;
    },
    [token]
  );

  type GetParsedResponse = (
    r: FetchResponse
  ) => Promise<ResponseShape<ResultShape> | undefined>;
  const getParsedResponse = useCallback<GetParsedResponse>(
    async res => {
      try {
        const payloadString = await res.text();
        const payload = JSON.parse(payloadString) as ResponseShape<ResultShape>;
        return payload;
      } catch (ex) {
        notify(ex.message);
        return undefined;
      }
    },
    [notify]
  );

  type RestFetch = (
    url: string,
    p?: Params
  ) => Promise<ResponseShape<ResultShape> | undefined>;
  const restFetch = useCallback<RestFetch>(
    async (url, params) => {
      const { data, queryParams, method = "GET", isAuthenticated = true } =
        params || {};

      const body = JSON.stringify(data);
      const Authorization = getAuthorization(isAuthenticated);
      if (isAuthenticated && !Authorization) return undefined;

      const headers = {
        Authorization,
        "Content-Type": "application/json"
      };
      const sQueryParams = queryParams ? `?${stringify(queryParams)}` : "";

      const res = await fetch(`${defaultApiDomain}${url}${sQueryParams}`, {
        body,
        headers,
        method
      });
      return getParsedResponse(res);
    },
    [getAuthorization, getParsedResponse]
  );

  return { notify, restFetch };
}

export default useRestFetch;
