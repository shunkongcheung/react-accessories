import { useCallback } from "react";
import useRestFetch from "./useRestFetch";
import { useAuthContext } from "../auth";

type ErrorLvl = "info" | "warn" | "error" | "none";
type Method = "POST" | "PUT";

interface Error {
  msg: string;
  param?: string;
}
interface Params {
  data: object;
  method?: Method;
  isAuthenticated?: boolean;
  setFieldError?: SetFieldError;
}

interface FetchEditParams<ResultShape extends object> {
  apiDomain?: string;
  errorLvl?: ErrorLvl;
  parseEditResult?: (d: any) => { result?: ResultShape; errors?: Array<Error> };
}

type NotifyNonFieldErrors = (
  data: object,
  errors: Array<Error>,
  setFieldError?: SetFieldError
) => void;
type SetFieldError = (name: string, error: string) => any;

function useFetchEdit<ResultShape extends object = {}>(
  fetchEditParams?: FetchEditParams<ResultShape>
) {
  const { defaultApiDomain, defaultParseEditResult } = useAuthContext();
  const {
    apiDomain = defaultApiDomain,
    errorLvl,
    parseEditResult = defaultParseEditResult
  } = fetchEditParams || {};

  const { notify, restFetch } = useRestFetch<ResultShape>(apiDomain, errorLvl);

  const notifyNonFieldErrors = useCallback<NotifyNonFieldErrors>(
    (data, errors, setFieldError) => {
      for (let { msg, param } of errors) {
        if (setFieldError && param && data.hasOwnProperty(param))
          setFieldError(param, msg);
        else notify(`${param ? `${param}: ` : ""}${msg}`);
      }
    },
    [notify]
  );

  type FetchEdit = (u: string, p: Params) => Promise<ResultShape | undefined>;
  const fetchEdit = useCallback<FetchEdit>(
    async (url, params) => {
      const {
        data,
        method = "POST",
        isAuthenticated = true,
        setFieldError
      } = params;
      const res = await restFetch(url, {
        data,
        method,
        isAuthenticated
      });
      if (!res) return;

      const { errors, result } = parseEditResult(res);
      if (errors) {
        notifyNonFieldErrors(data, errors, setFieldError);
        throw errors;
      }

      return result;
    },
    [notifyNonFieldErrors, restFetch]
  );

  return fetchEdit;
}

export default useFetchEdit;
