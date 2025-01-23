import { getTourWithCache } from "@/actions/auth/tour";

import { styled } from "@/styled-system/jsx";
import { Heading } from "@/components/ui/heading";

type Props = {
  tourId: string;
};

export async function Tour({ tourId }: Props) {
  const { result } = await getTourWithCache(tourId);

  return (
    <>
      <Heading as="h2" fontSize="lg">
        ツアー
      </Heading>
      <styled.p mt="1">{result?.at(0)?.name || tourId}</styled.p>
    </>
  );
}
