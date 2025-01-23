import { Container, Box } from "@/styled-system/jsx";
import { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import { Ja } from "./_components/Ja";
import { En } from "./_components/En";
import { ZhHans } from "./_components/ZhHans";
import { ZhHant } from "./_components/ZhHant";
import "@/lib/style/utilities/article.css";

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.privacyPolicy;

  const title = dictionary.meta.title;
  const description = dictionary.meta.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const locale = localeFromString((await params).locale);

  return (
    <Container pt={{ base: "10", lg: "20" }}>
      <Box className="article">
        {locale === Locale.JA && <Ja />}
        {locale === Locale.EN && <En />}
        {locale === Locale.ZH_HANS && <ZhHans />}
        {locale === Locale.ZH_HANT && <ZhHant />}
      </Box>
    </Container>
  );
}
