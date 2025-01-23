import { Box, HStack } from "@/styled-system/jsx";
import { Text } from "@/components/ui/text";

type Status = "saved" | "error" | "pending";

type Props = {
  status: Status;
  showText?: boolean;
};

export function Status({ status, showText }: Props) {
  return (
    <HStack alignItems="center" gap="2">
      <Box
        w="2"
        aspectRatio="1/1"
        borderRadius="50%"
        bgColor={getColor(status)}
      />
      {showText && (
        <Text color={getColor(status)} fontSize="sm" lineHeight="1">
          {getText(status)}
        </Text>
      )}
    </HStack>
  );
}

function getText(status: Status) {
  switch (status) {
    case "saved":
      return "保存済み";
    case "error":
      return "エラー";
    case "pending":
      return "処理中";
  }
}

function getColor(status: Status) {
  switch (status) {
    case "saved":
      return "grass.light.9";
    case "error":
      return "tomato.light.9";
    case "pending":
      return "amber.light.9";
  }
}
