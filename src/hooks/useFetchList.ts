import { useCallback, useState } from "react";

import useRestFetch from "./useRestFetch";
import { useAuthContext } from "../auth";

type ErrorLvl = "warn" | "error" | "info";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

interface FetchListParams<Shape extends object> {
  apiDomain?: string;
  errorLvl?: ErrorLvl;
  parseListResult?: (data: any) => { result?: Array<Shape>; errors?: any };
}

function useFetchList<Shape extends object>(
  fetchListParams?: FetchListParams<Shape>
) {
  const { defaultApiDomain, defaultParseListResult } = useAuthContext();

  const {
    apiDomain = defaultApiDomain,
    errorLvl,
    parseListResult = defaultParseListResult
  } = fetchListParams || {};

  const { restFetch, notify } = useRestFetch<Shape>(apiDomain, errorLvl);

  interface FetchListState {
    loading: boolean;
    result: Array<Shape>;
  }
  const [fetchListState, setFetchListState] = useState<FetchListState>({
    loading: false,
    result: []
  });

  const fetchList = useCallback(
    async (url, params?: Params) => {
      setFetchListState(oState => ({ ...oState, loading: true }));
      const res = await restFetch(url, { ...params });
      if (!res) return;
      const { result, errors } = parseListResult(res);
      if (errors) notify(errors);

      setFetchListState(oState => ({
        result: result || oState.result,
        loading: false
      }));
    },
    [restFetch]
  );

  return { ...fetchListState, fetchList };
}

export default useFetchList;
