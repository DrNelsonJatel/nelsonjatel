// Publications and theses.
// Add entries below and the "Publications" tab appears in the nav automatically
// (it stays hidden while this list is empty, so there is never a placeholder).
// Newest year sorts first. Theses render in their own section.

export type PubType = 'thesis' | 'journal' | 'conference' | 'report' | 'chapter';

export interface Publication {
  title: string;
  authors: string;        // e.g. "Jatel, N. R." or "Jatel, N. R., & Smith, A."
  year: number;
  venue: string;          // journal, publisher, conference, or degree-granting institution
  type: PubType;
  url?: string;           // DOI link (preferred) or stable URL
  note?: string;          // optional one-line context (e.g. "Doctoral thesis")
}

export const PUBLICATIONS: Publication[] = [
  // Example shape (delete once real entries are in):
  // {
  //   title: 'Mapping fifty years of water-governance meetings: a social network analysis',
  //   authors: 'Jatel, N. R.',
  //   year: 2023,
  //   venue: 'Royal Roads University',
  //   type: 'thesis',
  //   url: 'https://viurrspace.ca/...',
  //   note: 'Doctoral thesis (DSocSci)',
  // },
];
