"use client";

import { useEffect } from "react";

export function AdminMode() {
  useEffect(() => {
    document.body.style.cursor = "default";
    document.documentElement.style.cursor = "default";
    return () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, []);
  return null;
}
