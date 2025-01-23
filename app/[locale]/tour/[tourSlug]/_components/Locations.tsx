import type { Locale } from "@/lib/i18n";
import { listTourLocationsWithCache } from "@/actions/public/tour";

import { Grid } from "@/styled-system/jsx";
import { Item } from "@/components/location/PublicItem";

type Props = {
  tourId: string;
  locale: Locale;
};

export async function Locations({ tourId, locale }: Props) {
  const { result } = await listTourLocationsWithCache(tourId);

  return (
    <Grid
      gridTemplateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={{ base: "8", sm: "6" }}
    >
      {result?.map((tour) => (
        <Item key={tour.id} item={tour} locale={locale} />
      ))}
    </Grid>
  );
}
