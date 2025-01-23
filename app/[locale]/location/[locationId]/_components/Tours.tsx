import type { Locale } from "@/lib/i18n";
import { listLocationToursWithCache } from "@/actions/public/location";

import { Grid } from "@/styled-system/jsx";
import { Item } from "@/components/tour/PublicItem";

type Props = {
  locationId: string;
  locale: Locale;
};

export async function Tours({ locationId, locale }: Props) {
  const { result } = await listLocationToursWithCache(locationId);

  return (
    <Grid
      gridTemplateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={{ base: "8", sm: "6" }}
    >
      {result?.map((tour) => (
        <Item key={tour.id} item={tour} locale={locale} />
      ))}
    </Grid>
  );
}
