import { useCallback, useEffect, useRef, useState } from "react";

function useFakeFetchDetail<Shape extends object>(
  initialValues: Shape,
  data: Shape
) {
  const [detailState, setDetailState] = useState({
    loading: true,
    result: initialValues
  });
  const dataRef = useRef(data);
  const initialValuesRef = useRef<Shape>(initialValues);

  // @ts-ignore
  const fetchDetail = useCallback(async (u: string, q?: object) => {
    setDetailState(oVal => ({ ...oVal, loading: true }));
    return new Promise(r => {
      setTimeout(() => {
        setDetailState({ result: dataRef.current, loading: false });
        r();
      }, Math.random() * 1000);
    });
  }, []);

  const resetDetail = useCallback(() => {
    setDetailState({
      result: initialValuesRef.current,
      loading: false
    });
  }, []);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  return { ...detailState, fetchDetail, resetDetail };
}

export default useFakeFetchDetail;
