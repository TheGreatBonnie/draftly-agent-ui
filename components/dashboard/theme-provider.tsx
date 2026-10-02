"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { applyTheme, setThemeLock } from "@/lib/theme/apply";
import { THEME_STORAGE_KEY, type ResolvedTheme, type Theme } from "@/lib/theme/resolve";

type ThemeContextValue = { theme: Theme; resolvedTheme: ResolvedTheme; setTheme: (theme:Theme)=>void; toggleTheme:()=>void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefersDarkOS(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function paint(theme:Theme):ResolvedTheme {
  return applyTheme(document.documentElement,theme,prefersDarkOS());
}
function readStoredTheme():Theme {
  return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
}

export function ThemeProvider({children,lockTheme}:{children:ReactNode;lockTheme?:Theme}) {
  const [theme,setThemeState]=useState<Theme>(lockTheme ?? "system");
  const [resolvedTheme,setResolvedTheme]=useState<ResolvedTheme>("light");
  useEffect(()=>{
    if(lockTheme){
      // Register before painting. Child effects run before ancestors', so the
      // ancestor provider's own mount effect already resolves through this lock.
      setThemeLock(lockTheme);
      setThemeState(lockTheme);
      setResolvedTheme(paint(lockTheme));
      return ()=>{
        // <html> was repainted under the ancestor's feet — hand it its theme back.
        setThemeLock(null);
        paint(readStoredTheme());
      };
    }
    const saved=readStoredTheme();
    setThemeState(saved);
    setResolvedTheme(paint(saved));
  },[lockTheme]);
  useEffect(()=>{
    if(theme!=="system") return;
    const media=window.matchMedia("(prefers-color-scheme: dark)");
    const onChange=()=>setResolvedTheme(paint("system"));
    media.addEventListener("change",onChange);
    return ()=>media.removeEventListener("change",onChange);
  },[theme]);
  const setTheme=(next:Theme)=>{
    if(lockTheme) return;
    localStorage.setItem(THEME_STORAGE_KEY,next);
    setThemeState(next);
    setResolvedTheme(paint(next));
  };
  const toggleTheme=()=>setTheme(resolvedTheme === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{theme,resolvedTheme,setTheme,toggleTheme}}>{children}</ThemeContext.Provider>;
}

export function useTheme(){
  const ctx=useContext(ThemeContext);
  if(!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
