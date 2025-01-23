"use client";

import { usePathname } from "next/navigation";

import NextLink from "next/link";
import { styled } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";

type Link = {
  href: string;
  text: string;
  icon: React.ReactNode;
  isSingular?: boolean;
  target?: string;
};

type Props = {
  links: Link[];
};

export function Links({ links }: Props) {
  const pathname = usePathname();

  return (
    <styled.ul display="flex" flexDirection="column" gap="2" listStyle="none">
      {links.map((link) => {
        let isActive = false;
        if (link.isSingular) {
          isActive = link.href === pathname;
        } else {
          const regex = new RegExp(`^${link.href}/`);
          isActive = regex.test(`${pathname}/`);
        }
        return (
          <li key={link.href}>
            <Button
              asChild
              variant={isActive ? "subtle" : "ghost"}
              justifyContent="start"
              w="full"
              fontSize="0.875rem"
            >
              <NextLink href={link.href} target={link.target || "_self"}>
                {link.icon}
                {link.text}
              </NextLink>
            </Button>
          </li>
        );
      })}
    </styled.ul>
  );
}
