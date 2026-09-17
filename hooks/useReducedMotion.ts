"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPrefersReducedMotion } from "../store/slices/themeSlice";

export function useReducedMotion(): boolean {
  const dispatch = useAppDispatch();
  const prefersReduced = useAppSelector(
    (state) => state.theme.prefersReducedMotion
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    dispatch(setPrefersReducedMotion(mediaQuery.matches));

    const handler = (event: MediaQueryListEvent) => {
      dispatch(setPrefersReducedMotion(event.matches));
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [dispatch]);

  return prefersReduced;
}
