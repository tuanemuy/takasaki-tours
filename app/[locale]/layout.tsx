import { locales, localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import { Suspense } from "react";
import NextLink from "next/link";
import Script from "next/script";
import { googleRecaptchaSiteKey } from "@/lib/config";
import { Link } from "@/components/ui/link";
import { DictionaryProvider } from "@/lib/i18n/context";
import { Container, Box, HStack, styled } from "@/styled-system/jsx";
import { ChangeLocale } from "./_components/ChangeLocale";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
  pre: React.ReactNode;
  h1: React.ReactNode;
  children: React.ReactNode;
};

export default async function Layout({ params, pre, h1, children }: Props) {
  const locale = localeFromString((await params).locale);
  const _dictionary = await getDictionary(locale);
  const dictionary = _dictionary.pages.public.layout;

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`}
      />

      <DictionaryProvider dictionary={_dictionary.general}>
        <Box
          position="sticky"
          zIndex="2"
          top="0"
          w="full"
          h={{ base: "56px", md: "72px" }}
          bg="bg.default"
          boxShadow="md"
        >
          <HStack
            w={{ base: "94%" }}
            h="full"
            mx="auto"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link href={`/${locale}`}>
              <styled.img
                src="/images/logo.png"
                alt="TAKASAKI TOURS"
                h={{ base: "0.875rem", md: "1rem" }}
                aspectRatio="797/64"
              />
            </Link>

            <Suspense>
              <ChangeLocale />
            </Suspense>
          </HStack>
        </Box>

        <Box
          position="relative"
          zIndex="1"
          w={{ base: "94%" }}
          mx="auto"
          mt="2"
        >
          {pre}
        </Box>

        <Box position="relative" zIndex="1">
          {children}
        </Box>

        <Container py="20">
          <Link href={`/${locale}`}>
            <styled.img
              src="/images/logo.png"
              alt="TAKASAKI TOURS"
              w="320px"
              h="auto"
              maxW="full"
            />
          </Link>

          {h1 && <styled.h1 mt="1">{h1}</styled.h1>}

          <HStack gap="8" flexWrap="wrap" mt="4">
            {dictionary.links.map((link: { name: string; href: string }) => {
              return (
                <Link key={link.href} textDecoration="underline" asChild>
                  <NextLink href={`/${locale}${link.href}`}>
                    {link.name}
                  </NextLink>
                </Link>
              );
            })}
          </HStack>
        </Container>

        <Container py="1">
          <styled.p fontSize="0.875rem">{dictionary.copyright}</styled.p>
        </Container>
      </DictionaryProvider>
    </>
  );
}
