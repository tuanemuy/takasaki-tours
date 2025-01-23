"use client";

import { createContext, useContext } from "react";
import type { getDictionary } from "@/lib/i18n/dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["general"];

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (dictionary === null) {
    throw new Error(
      "useDictionary hook must be used within DictionaryProvider",
    );
  }

  return dictionary;
}
