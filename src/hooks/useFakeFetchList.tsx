import { useCallback, useState, useRef } from "react";

interface Params {
  queryParams?: object;
  isAuthenticated?: boolean;
}

function useFakeFetchList<Item>(fakeData: Array<Item>) {
  const fakeDataRef = useRef(fakeData);
  const [fetchListState, setFetchListState] = useState<{
    loading: boolean;
    results: Array<any>;
  }>({
    loading: true,
    results: []
  });

  // @ts-ignore
  const fetchList = useCallback(async (url: string, params?: Params): Promise<
    Array<Item>
  > => {
    setFetchListState(oState => ({ ...oState, loading: true }));
    return new Promise(r => {
      setTimeout(() => {
        setFetchListState({ results: fakeDataRef.current, loading: false });
        r();
      }, Math.random() * 1000);
    });
  }, []);

  return { ...fetchListState, fetchList };
}

export default useFakeFetchList;
