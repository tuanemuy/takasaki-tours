import type { Metadata } from "next";
import { appName } from "@/lib/config";

import { Toaster } from "@/components/ui/toaster";
import "@/lib/style/global.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  applicationName: appName,
  appleWebApp: {
    title: appName,
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
