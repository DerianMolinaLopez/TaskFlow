"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHANGE_EVENT = "taskflow:data-changed";

// Avisa a todos los useApi montados que deben volver a consultar
// (por ejemplo, tras crear o eliminar una tarea).
export function notifyDataChanged() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

type State<T> = {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
};

// Consulta asíncrona mínima: conserva los datos anteriores mientras recarga,
// ignora respuestas obsoletas y se refresca con notifyDataChanged().
export function useApi<T>(fetcher: () => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: null, loading: true });
  const requestId = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(() => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true }));
    fetcherRef.current().then(
      (data) => {
        if (id === requestId.current) setState({ data, error: null, loading: false });
      },
      (error: Error) => {
        if (id === requestId.current) setState((prev) => ({ ...prev, error, loading: false }));
      },
    );
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, deps);

  useEffect(() => {
    window.addEventListener(CHANGE_EVENT, load);
    return () => window.removeEventListener(CHANGE_EVENT, load);
  }, [load]);

  return { ...state, reload: load };
}
