import { useCallback, useRef } from "react";

function useFakeRestFetch<Shape extends object>(data: Shape) {
  const dataRef = useRef(data);

  // @ts-ignore
  const restFetch = useCallback(async (u: string): Promise<{
    result: Shape;
  }> => {
    return new Promise(r => {
      setTimeout(() => r({ result: dataRef.current }), Math.random() * 1000);
    });
  }, []);

  return { restFetch };
}

export default useFakeRestFetch;
