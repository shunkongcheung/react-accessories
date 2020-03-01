import { useCallback } from "react";
import useRestFetch from "./useRestFetch";

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

type ErrorLvl = "info" | "warn" | "error" | "none";
type Method = "POST" | "PUT";

type NotifyNonFieldErrors = (
  data: object,
  errors: Array<Error>,
  setFieldError?: SetFieldError
) => void;
type SetFieldError = (name: string, error: string) => any;

function useFetchEdit<ResultShape extends object = {}>(errorLvl?: ErrorLvl) {
  const { notify, restFetch } = useRestFetch<ResultShape>(errorLvl);

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

      const { errors, result } = res;
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
