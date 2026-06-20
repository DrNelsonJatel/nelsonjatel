// Self-published books. The "Books" tab + homepage pillar appear automatically
// when this list is non-empty. Thresan fiction does NOT belong here (it lives on
// its own site); this is the speaker-brand nonfiction only.

export interface Book {
  title: string;
  subtitle?: string;
  description: string;   // site voice: first person, no filler, Canadian spelling
  audience?: string;     // "who it's for" line
  year: number;
  format?: string;       // e.g. "Kindle ebook"
  buyUrl: string;
  buyLabel?: string;
  cover?: string;        // /images/... path (hosted) or absolute URL; optional
}

export const BOOKS: Book[] = [
  {
    title: 'Negotiation and Co-Creation',
    subtitle: 'A Comparative Study of Decision-Making Processes',
    description:
      'In this short book I put two modes of collective decision-making side by ' +
      'side: negotiation and co-creation. I trace where each comes from, what ' +
      'each is good for, and how power, trust, and the idea of ethical space ' +
      'shape the outcome, with real cases of both. It is for anyone who has to ' +
      'reach a decision with other people and wants a clearer way to think about how.',
    audience: 'Boards, leaders, negotiators, and anyone navigating collaborative decisions.',
    year: 2023,
    format: 'Kindle ebook · Limnology Research Corp.',
    buyUrl: 'https://www.amazon.ca/dp/B0CC98Z6J8',
    buyLabel: 'Buy on Amazon',
    cover: '/images/book-negotiation-cocreation.jpg',
  },
];
