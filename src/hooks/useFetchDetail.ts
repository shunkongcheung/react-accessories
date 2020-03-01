import { useCallback, useEffect, useState, useRef } from "react";
import useRestFetch from "./useRestFetch";

type ErrorLvl = "warn" | "error" | "info";

function useFetchDetail<Shape extends object>(
  initialValues: Shape,
  errorLvl?: ErrorLvl
) {
  interface FetchDetailState {
    loading: boolean;
    result: Shape;
  }
  const [fetchDetailState, setFetchDetailState] = useState<FetchDetailState>({
    loading: true,
    result: initialValues
  });
  const { notify, restFetch } = useRestFetch<Shape>(errorLvl);
  const initialValuesRef = useRef<Shape>(initialValues);

  const fetchDetail = useCallback(
    async (url: string, queryParams?: object) => {
      setFetchDetailState(oState => ({ ...oState, loading: true }));
      const res = await restFetch(url, { queryParams });
      if (!res) return;

      const { result, errors } = res;
      if (errors) notify(errors);
      if (!result) return;
      setFetchDetailState({ result, loading: false });
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
