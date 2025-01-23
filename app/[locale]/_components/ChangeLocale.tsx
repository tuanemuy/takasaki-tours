"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { locales } from "@/lib/i18n";

import Link from "next/link";
import { HStack, styled } from "@/styled-system/jsx";
import { Menu } from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";
import { ChevronDown, Earth } from "lucide-react";

export function ChangeLocale() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const regex = /^\/(?<locale>[^\/]+)(?<path>\/.*)?$/;
  const matches = regex.exec(pathname);
  const currentLocale = matches?.groups?.locale;
  const path = matches?.groups?.path;

  return (
    <Menu.Root>
      <Menu.Trigger cursor="pointer">
        <HStack
          alignItems="center"
          gap="2"
          p="1"
          pt="0"
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Icon size="sm">
            <Earth />
          </Icon>
          <styled.span fontSize="sm">{currentLocale || "-"}</styled.span>
          <Icon size="sm">
            <ChevronDown />
          </Icon>
        </HStack>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          {locales.map((locale) => {
            return (
              <Menu.Item key={locale} value={locale} asChild>
                <Link
                  href={`/${locale}${path || ""}?${searchParams.toString()}`}
                >
                  {locale}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
