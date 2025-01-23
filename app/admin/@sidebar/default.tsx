import { connection } from "next/server";
import { Box } from "@/styled-system/jsx";
import { Links } from "@/components/sidebar/Links";
import { Info } from "@/components/user/Info";
import { ScrollText, MapPin } from "lucide-react";

const links = [
  {
    href: "/user/tour",
    text: "ツアー",
    icon: <ScrollText />,
  },
  {
    href: "/user/location",
    text: "場所",
    icon: <MapPin />,
  },
];

export default async function DefaultSidebar() {
  await connection();

  return (
    <>
      <Info />

      <Box mt="6">
        <Links links={links} />
      </Box>
    </>
  );
}
