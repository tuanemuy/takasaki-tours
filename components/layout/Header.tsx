import Link from "next/link";
import { Box, HStack } from "@/styled-system/jsx";
import { Text } from "@/components/ui/text";
import { IconButton } from "@/components/ui/icon-button";
import { Undo2 } from "lucide-react";

type Props = {
  text: string;
  returnUrl?: string;
  buttons?: React.ReactNode[];
};

export function Header({ text, returnUrl, buttons }: Props) {
  return (
    <Box position="relative" w="full">
      <HStack position="relative" justifyContent="space-between" w="full">
        <HStack gap="4">
          {returnUrl && (
            <IconButton asChild size="sm" variant="outline" borderRadius="50%">
              <Link href={returnUrl}>
                <Undo2 />
              </Link>
            </IconButton>
          )}
          <Text fontWeight="bold" fontSize="xl" lineHeight="1.4rem">
            {text}
          </Text>
        </HStack>

        <HStack gap="2">
          {buttons?.map((button, index) => {
            return <Box key={index.toString()}>{button}</Box>;
          })}
        </HStack>
      </HStack>
    </Box>
  );
}
