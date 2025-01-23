import Link from "next/link";
import { styled } from "@/styled-system/jsx";
import { ChevronRight } from "lucide-react";

type Props = {
  links: { href: string; label: string }[];
};

export function BreadCrumb({ links }: Props) {
  return (
    <styled.nav aria-label="breadcrumb">
      <styled.ul
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap="1"
        css={{
          "& > li": {
            display: "flex",
            alignItems: "center",
            flexShrink: "0",
            gap: "1",
          },
          "& > li a": {
            fontSize: "0.875rem",
            lineHeight: "1.5",
          },
          "& > li:not(:last-of-type) a": {
            textDecoration: "underline",
          },
        }}
      >
        {links.map((link, index) => (
          <li key={link.href}>
            {index !== 0 && <ChevronRight size={14} />}
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </styled.ul>
    </styled.nav>
  );
}
