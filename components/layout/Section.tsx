import { Box, styled } from "@/styled-system/jsx";
import { Heading } from "./Heading";

type Prosp = {
  name: string;
  children: React.ReactNode;
};

export function Section({ name, children }: Prosp) {
  return (
    <styled.section pt={{ base: "10", lg: "20" }}>
      <Heading name={name} />

      <Box mt={{ base: "8", lg: "12" }}>{children}</Box>
    </styled.section>
  );
}
