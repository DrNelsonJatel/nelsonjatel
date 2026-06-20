// Publications and theses.
// The "Publications" tab appears in the nav automatically because this list is
// non-empty. Newest year sorts first; theses render in their own section.

export type PubType = 'thesis' | 'journal' | 'conference' | 'report' | 'chapter';

export interface Publication {
  title: string;
  authors: string;        // e.g. "Jatel, N." or "Jatel, N., & Smith, A."
  year: number;
  venue: string;          // journal, publisher, conference, or institution
  type: PubType;
  url?: string;           // DOI link (preferred) or stable URL
  note?: string;          // optional one-line context (e.g. "Doctoral dissertation")
}

export const PUBLICATIONS: Publication[] = [
  {
    title: 'Testing social network metrics as proxies for governance performance: A simulation-based experiment in watershed management',
    authors: 'Jatel, N.',
    year: 2025,
    venue: 'Ecological Informatics, 92, 103442',
    type: 'journal',
    url: 'https://doi.org/10.1016/j.ecoinf.2025.103442',
  },
  {
    title: "Integrated water resource management and British Columbia's Okanagan Basin Water Board",
    authors: 'Melnychuk, N., Jatel, N., & Warwick Sears, A. L.',
    year: 2017,
    venue: 'International Journal of Water Resources Development, 33(3), 408-425',
    type: 'journal',
    url: 'https://doi.org/10.1080/07900627.2016.1214909',
  },
  {
    title: 'Water governance: New performance measures for diagnosing a watershed organization',
    authors: 'Jatel, N. R.',
    year: 2023,
    venue: 'Royal Roads University',
    type: 'thesis',
    note: 'Doctoral dissertation (Doctorate of Social Science)',
    url: 'https://www.proquest.com/openview/db8332fd0f735fd31f52c9b893e66c2a/1?pq-origsite=gscholar&cbl=18750&diss=y',
  },
  {
    title: 'Using social network analysis to make invisible human actor water governance networks visible: The case of the Okanagan valley',
    authors: 'Jatel, N.',
    year: 2013,
    venue: 'University of British Columbia (Okanagan)',
    type: 'thesis',
    note: "Master's thesis",
    url: 'https://open.library.ubc.ca/soa/cIRcle/collections/ubctheses/24/items/1.0074319',
  },
];
