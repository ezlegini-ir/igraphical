"use client";

import { useState } from "react";
import * as React from "react";

export const useError = () => {
  const [error, setError] = useState("");
  return { error, setError };
};

//-----------------------------------

export const useFileName = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  return { fileName, setFileName };
};

//-----------------------------------

export const useImagePreview = (defaultPreview: string | undefined) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    defaultPreview
  );
  return { imagePreview, setImagePreview };
};

//-----------------------------------

export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
};

//-----------------------------------

export const useOpen = () => {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
};

//-----------------------------------

export const useSuccess = () => {
  const [success, setSuccess] = useState("");
  return { success, setSuccess };
};

//-----------------------------------

export const useValue = (defaultValue: string = "") => {
  const [value, setValue] = useState(defaultValue);
  return { value, setValue };
};

//-----------------------------------

export const useIdentifier = () => {
  const [identifier, setIdentifier] = useState("");
  return { identifier, setIdentifier };
};

//-----------------------------------

export const useLoginStep = <T extends string>(steps: T[]) => {
  const [loginStep, setLoginStep] = useState<T>(steps[0]);

  return { loginStep, setLoginStep };
};

//-----------------------------------

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

//-----------------------------------

export const useTimeRange = (defaultRange: string) => {
  const [timeRange, setTimeRange] = useState(defaultRange);
  return { timeRange, setTimeRange };
};
