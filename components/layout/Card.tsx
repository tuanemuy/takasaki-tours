import { Box } from "@/styled-system/jsx";

type Props = {
  children: React.ReactNode;
};

export function Card({ children }: Props) {
  return (
    <Box p="6" bg="default" borderRadius="md" boxShadow="lg">
      {children}
    </Box>
  );
}
