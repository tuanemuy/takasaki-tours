import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import { DictionaryProvider } from "@/lib/i18n/context";
import { Frame } from "@/components/layout/Frame";

type Props = {
  sidebar: React.ReactNode;
  trailing: React.ReactNode;
  children: React.ReactNode;
};

export default async function Layout({ sidebar, trailing, children }: Props) {
  const dictionary = await getDictionary(Locale.JA);

  return (
    <DictionaryProvider dictionary={dictionary.general}>
      <Frame sidebar={sidebar} trailing={trailing}>
        {children}
      </Frame>
    </DictionaryProvider>
  );
}
