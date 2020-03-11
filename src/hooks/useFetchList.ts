import { useCallback, useState } from "react";

import useRestFetch from "./useRestFetch";
import { useAuthContext } from "../auth";

type ErrorLvl = "warn" | "error" | "info";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

interface Result<Shape> {
  currentPage: number;
  errors?: any;
  maxPage: number;
  result?: Array<Shape>;
}

interface FetchListParams<Shape extends object> {
  apiDomain?: string;
  errorLvl?: ErrorLvl;
  parseListResult?: (data: any, queryParams: object) => Result<Shape>;
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
    currentPage: number;
    loading: boolean;
    maxPage: number;
    result: Array<Shape>;
  }
  const [fetchListState, setFetchListState] = useState<FetchListState>({
    loading: false,
    result: [],
    currentPage: 1,
    maxPage: 1
  });

  const fetchList = useCallback(
    async (url, params?: Params) => {
      setFetchListState(oState => ({ ...oState, loading: true }));
      const res = await restFetch(url, { ...params });
      const { queryParams = {} } = params || {};
      if (!res) return;
      const { currentPage, maxPage, result, errors } = parseListResult(
        res,
        queryParams
      );
      if (errors) notify(errors);

      setFetchListState(oState => ({
        result: result || oState.result,
        currentPage: currentPage || oState.currentPage,
        maxPage: maxPage || oState.maxPage,
        loading: false
      }));
    },
    [restFetch]
  );

  return { ...fetchListState, fetchList };
}

export default useFetchList;
