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
    title: 'Social Network Analysis Research Report: Realizing Relationships for Distance Education',
    authors: 'Jatel, N.',
    year: 2022,
    venue: 'Inter-agency Network for Education in Emergencies (INEE)',
    type: 'report',
    note: 'Pilot studies in Jordan and Uganda',
    url: 'https://inee.org/resources/social-network-analysis-research-report-realizing-relationships-distance-education',
  },
  {
    title: 'Understanding collaborative community-based mental health services for adults 50 and over in the South Okanagan through an environmental scan and social network analysis',
    authors: 'Jatel, N.',
    year: 2017,
    venue: 'University of British Columbia Okanagan',
    type: 'report',
  },
  {
    title: 'UBC Okanagan Water Research Network: A Social Network Analysis',
    authors: 'Jatel, N.',
    year: 2017,
    venue: 'University of British Columbia Okanagan',
    type: 'report',
    note: 'Network summary graphs',
    url: 'https://static1.squarespace.com/static/5b7754674cde7af38533da20/t/5b995e421ae6cfe40ed7a68c/1536777794707/2017_UBCO+water+research+network_summary_jatel_SummaryGraphs.pdf',
  },
  {
    title: 'Indigenous Watershed Initiatives and Co-Governance Arrangements: A British Columbia Systematic Review',
    authors: 'Jatel, N.',
    year: 2016,
    venue: 'First Nations Fisheries Council & Centre for Indigenous Environmental Resources',
    type: 'report',
    note: 'Final report',
    url: 'https://watershedsbc.ca/resource/indigenous-watershed-initiatives-and-co-governance-arrangements-a-british-columbia-systematic-review/',
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
    note: 'M.A. thesis',
    url: 'https://open.library.ubc.ca/soa/cIRcle/collections/ubctheses/24/items/1.0074319',
  },
];
