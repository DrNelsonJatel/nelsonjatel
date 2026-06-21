// Selected speaking engagements. Verified events only; newest first.
// Single source of truth for the "Selected speaking engagements" section on the
// Speaking and speaker-kit pages. The compact home-page marquee uses PROOF_BAR
// in consts.ts (a curated short list, a different purpose).
//   year  - four-digit year of the event
//   title - event name (use a colon for a subtitle, never a dash)
//   host  - optional organising body or location
//   note  - optional role, talk title, or context (e.g. chair, host, keynote)
//   url   - optional link to a verified record (proceedings, programme)
export interface Engagement {
  year: number;
  title: string;
  host?: string;
  note?: string;
  url?: string;
}

export const SPEAKING_HISTORY: Engagement[] = [
  {
    year: 2026,
    title: 'Canadian Water Resources Association National Conference',
    host: 'Winnipeg, Manitoba',
    note: 'From hydrometric monitoring networks to watershed management tools: An operational stream-temperature forecast for the Okanagan Basin',
  },
  {
    year: 2026,
    title: 'Canadian Water Resources Association National Conference',
    host: 'Winnipeg, Manitoba',
    note: 'Networks of water (mis)information in the 2026 Okanagan drought',
  },
  { year: 2024, title: 'Environmental Flows Conference: Co-Creating Futures' },
  { year: 2023, title: 'Mission Creek Workshop' },
  {
    year: 2020,
    title: 'The Okanagan Flood Story',
    host: 'GIS Day in Canada, Esri Canada',
    url: 'https://www.esri.ca/en-ca/news-events/events/seminars/past-proceedings/s2020/gis-day-in-canada',
  },
  { year: 2020, title: 'Raven Hydrology Model Workshop' },
  {
    year: 2018,
    title: 'Joint Conference on Forests and Water',
    host: 'Centro de Ciencia del Clima y la Resiliencia, Valdivia, Chile',
    note: "Water governance networks' influence on water ecological systems over time: An Okanagan valley, Canada case study",
    url: 'https://www.cr2.cl/wp-content/uploads/2018/12/Proceedings-Forests-Water-2018.pdf',
  },
  { year: 2018, title: 'Environmental Flow: Science, Policy and Practice' },
  { year: 2012, title: 'Okanagan Invitational Drought Tournament' },
  { year: 2012, title: 'Waterlution Okanagan' },
  { year: 2008, title: 'One Watershed, One Water' },
  {
    year: 2006,
    title: 'Global Competitiveness Summit',
    host: 'Okanagan Partnership Society',
    note: 'Chair and host; Premier Gordon Campbell, keynote speaker',
  },
  { year: 2005, title: 'Water: Our Limiting Resource' },
  { year: 2004, title: 'Okanagan Leadership Meeting: Running on Empty' },
];
