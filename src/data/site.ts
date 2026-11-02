export const SITE = {
  name: 'Glazehour',
  url: 'https://glazehour.space',
  domain: 'glazehour.space',
  email: 'safiya@glazehour.space',
};

export interface Person {
  name: string;
  initials: string;
  role: string;
  email?: string;
  bio: string;
  focus: string[];
}

/** The founding team, credited on the home page, About, Contact and in the footer. */
export const FOUNDERS: Person[] = [
  {
    name: 'Safiya Abdullahi',
    initials: 'SA',
    role: 'Founder/CEO',
    email: SITE.email,
    bio: 'Safiya founded Glazehour to help coating teams connect every defect to the process evidence behind it — and leads product, customers and every pilot.',
    focus: ['Product', 'Customers', 'Pilots'],
  },
  {
    name: 'Yusuf Abdulhamid',
    initials: 'YA',
    role: 'Co-founder/CTO',
    bio: 'Yusuf co-founded Glazehour and leads its technology — from photo and measurement capture and the specification-checking engine to the cloud platform it runs on.',
    focus: ['Evidence capture', 'Rules engine', 'Cloud platform'],
  },
];
