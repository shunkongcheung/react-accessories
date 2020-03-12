import { useCallback, useState } from "react";

import useRestFetch from "./useRestFetch";
import { useAuthContext } from "../auth";

type ErrorLvl = "warn" | "error" | "info";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

interface FetchDeleteParams {
  apiDomain?: string;
  errorLvl?: ErrorLvl;
}

function useFetchDelete(fetchDeleteParams?: FetchDeleteParams) {
  const { defaultApiDomain } = useAuthContext();
  const { apiDomain = defaultApiDomain, errorLvl } = fetchDeleteParams || {};

  const { restFetch } = useRestFetch<object>(apiDomain, errorLvl);
  const [fetchDeleteState, setFetchDeleteState] = useState({ loading: false });

  const fetchDelete = useCallback(
    async (url, params?: Params) => {
      setFetchDeleteState(oState => ({ ...oState, loading: true }));
      await restFetch(url, { ...params, method: "DELETE" });
      setFetchDeleteState({ loading: false });
    },
    [restFetch]
  );

  return { ...fetchDeleteState, fetchDelete };
}

export default useFetchDelete;
