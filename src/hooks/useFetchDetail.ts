import { useCallback, useEffect, useState, useRef } from "react";
import useRestFetch from "./useRestFetch";
import { useAuthContext } from "../auth";

type ErrorLvl = "warn" | "error" | "info";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

interface FetchDetailParams<Shape> {
  apiDomain?: string;
  errorLvl?: ErrorLvl;
  parseDetailResult: (d: any) => { result?: Shape; errors: any };
}

function useFetchDetail<Shape extends object>(
  initialValues: Shape,
  fetchDetailParams?: FetchDetailParams<Shape>
) {
  interface FetchDetailState {
    loading: boolean;
    result: Shape;
  }
  const { defaultApiDomain, defaultParseDetailResult } = useAuthContext();

  const {
    apiDomain = defaultApiDomain,
    errorLvl,
    parseDetailResult = defaultParseDetailResult
  } = fetchDetailParams || {};

  const [fetchDetailState, setFetchDetailState] = useState<FetchDetailState>({
    loading: true,
    result: initialValues
  });
  const { notify, restFetch } = useRestFetch<Shape>(apiDomain, errorLvl);
  const initialValuesRef = useRef<Shape>(initialValues);

  const fetchDetail = useCallback(
    async (url: string, params?: Params) => {
      const { queryParams, isAuthenticated } = params || {};
      setFetchDetailState(oState => ({ ...oState, loading: true }));
      const res = await restFetch(url, { queryParams, isAuthenticated });
      if (!res) {
        setFetchDetailState(oState => ({ ...oState, loading: false }));
        return;
      }

      const { result, errors } = parseDetailResult(res);
      if (errors) notify(errors);
      setFetchDetailState(oState => ({
        result: result || oState.result,
        loading: false
      }));
    },
    [notify, restFetch]
  );

  const resetDetail = useCallback(() => {
    setFetchDetailState({
      result: initialValuesRef.current,
      loading: false
    });
  }, []);

  const overwrite = useCallback(
    result => setFetchDetailState({ result, loading: false }),
    []
  );

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  return { ...fetchDetailState, fetchDetail, overwrite, resetDetail };
}

export default useFetchDetail;
