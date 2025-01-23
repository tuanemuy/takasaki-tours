import { Stack, styled } from "@/styled-system/jsx";

type Props = {
  list: {
    dt: string;
    dd: string;
    icon: React.ReactNode;
  }[];
  separator: string;
};

export function Information({ list, separator }: Props) {
  return (
    <styled.dl display="flex" flexDirection="column" gap="3">
      {list.map((l) => {
        return (
          <Stack
            key={l.dt}
            direction={{ base: "column", lg: "row" }}
            gap={{ base: "0", lg: "2" }}
            alignItems="start"
          >
            <styled.dt
              display="flex"
              alignItems="center"
              gap="2"
              flexWrap="nowrap"
            >
              {l.icon}
              <styled.span fontWeight="bold" whiteSpace="nowrap">
                {l.dt}
                {separator}
              </styled.span>
            </styled.dt>
            <styled.dl>{l.dd}</styled.dl>
          </Stack>
        );
      })}
    </styled.dl>
  );
}
