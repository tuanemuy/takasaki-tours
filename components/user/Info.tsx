import { getUserWithCache } from "@/actions/auth/user";

import { Flex, styled } from "@/styled-system/jsx";
import { Thumbnail } from "./Thumbnail";

export async function Info() {
  const { result } = await getUserWithCache();
  const user = result?.[0]?.user;
  const profile = result?.[0]?.profile;

  return (
    <Flex alignItems="center" gap="3">
      {profile?.thumbnailId && <Thumbnail fileId={profile.thumbnailId} />}

      <styled.p fontSize="0.9rem">{user?.name || "-"}</styled.p>
    </Flex>
  );
}
