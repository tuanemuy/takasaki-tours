"use client";

import { useState } from "react";

import { Box, Flex, styled } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "lucide-react";

type Props = {
  sidebar: React.ReactNode;
  trailing: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
};

export function Frame({ sidebar, trailing, wide, children }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box w="100dvw" h="100dvh" overflow="hidden">
      <styled.header
        position="relative"
        zIndex="2"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100dvw"
        h={{ base: "44px" }}
        px="2"
        borderBottom="1px solid token(colors.border.subtle)"
      >
        <styled.img
          src="/images/logo.png"
          alt="TAKASAKI TOURS"
          position="absolute"
          top="50%"
          left="50%"
          transform="translateY(-50%) translateX(-50%)"
          w="auto"
          h={{ base: "14px" }}
          aspectRatio="797/64"
        />
        <Flex alignItems="center" gap="2">
          <IconButton
            onClick={() => setExpanded((prev) => !prev)}
            aria-label="Sidebar"
            variant="ghost"
          >
            <Menu />
          </IconButton>
        </Flex>

        {trailing}
      </styled.header>

      <Box position="relative" zIndex="1" h={{ base: "calc(100% - 44px)" }}>
        <styled.aside
          position="absolute"
          zIndex="3"
          top="0"
          left="0"
          w={{ base: "270px", xl: "270px" }}
          h="100%"
          transform={{
            base: expanded ? "translateX(-100%)" : "translateX(0)",
            md:
              (expanded && !wide) || (!expanded && wide)
                ? "translateX(0)"
                : "translateX(-100%)",
          }}
          bg="bg.default"
          borderRight="1px solid"
          borderColor="border.subtle"
          transitionDuration="0.3s"
          overflowY="scroll"
        >
          <Box py="6" px="6">
            {sidebar}
          </Box>
        </styled.aside>

        <Box
          onClick={() => setExpanded(true)}
          position="absolute"
          zIndex="2"
          left="0"
          top="0"
          display={{ base: "block", md: wide ? "block" : "none" }}
          w="100dvw"
          h="100dvh"
          bg="fg.default"
          opacity={expanded ? "0" : "0.25"}
          transitionDuration="0.3s"
          pointerEvents={expanded ? "none" : "auto"}
        />
        <styled.main
          position="relative"
          zIndex="1"
          w="full"
          h="full"
          pl={{
            base: "0",
            md: expanded && !wide ? "270px" : "0",
            xl: expanded && !wide ? "270px" : "0",
          }}
          overflowX="hidden"
          overflowY="hidden"
          transitionDuration="0.3s"
        >
          {children}
        </styled.main>
      </Box>
    </Box>
  );
}
