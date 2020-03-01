import { useCallback, useState } from "react";

import useRestFetch from "./useRestFetch";

type ErrorLvl = "warn" | "error" | "info";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

function useFetchList<Shape extends object>(errorLvl?: ErrorLvl) {
  const { restFetch } = useRestFetch<Array<Shape>>(errorLvl);

  interface FetchListState {
    loading: boolean;
    results: Array<Shape>;
  }
  const [fetchListState, setFetchListState] = useState<FetchListState>({
    loading: false,
    results: []
  });

  const fetchList = useCallback(
    async (url, params?: Params) => {
      setFetchListState(oState => ({ ...oState, loading: true }));
      const res = await restFetch(url, { ...params });
      if (!res) return;

      const { result } = res;
      setFetchListState({ results: result, loading: false });
    },
    [restFetch]
  );

  return { ...fetchListState, fetchList };
}

export default useFetchList;
