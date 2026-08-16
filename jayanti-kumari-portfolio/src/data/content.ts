/**
 * Single source of truth for every word on the site.
 *
 * TODO(jayanti): `projects` is still PLACEHOLDER — swap in the real work.
 */

export const profile = {
  first: 'Jayanti',
  last: 'Kumari',
  role: 'Computer Science Engineering Student',
  tagline: 'I build for the web — and it looks back at you.',
  blurb:
    'Computer Science and Engineering undergrad at New Horizon College of Engineering, Bengaluru. I write code in Python, Java, C, C++ and JavaScript, and I build for the web.',
  location: 'Bengaluru, India',
  available: true,
  email: 'mailjayantikumari@gmail.com',
  /** file lives in public/, so it ships at the site root */
  resumeUrl: '/resume.pdf',
}

export const education = {
  degree: 'Bachelor of Engineering — Computer Science and Engineering',
  school: 'New Horizon College of Engineering, Bengaluru',
  years: '2023 — 2027',
  cgpa: '8.70',
}

export const stats = [
  { value: education.cgpa, label: 'CGPA' },
  { value: '2027', label: 'B.E. CSE, expected' },
  { value: '5', label: 'Programming languages' },
]

export const about = [
  'I started with a curiosity about how a page becomes a place, and stayed for the part where design and code stop arguing with each other.',
  'Currently in my B.E. in Computer Science and Engineering, splitting time between coursework, building things for the web, and getting fluent in the languages that hold the rest of it up.',
]

export const skills = [
  { title: 'Languages', items: ['Python', 'Java', 'C', 'C++', 'JavaScript'] },
  { title: 'Web Technologies', items: ['HTML', 'CSS'] },
  { title: 'Tools & Platforms', items: ['Git', 'GitHub'] },
  {
    title: 'Soft Skills',
    items: [
      'Communication',
      'Time Management',
      'Problem Solving',
      'Critical Thinking',
      'Adaptability',
      'Stress Management',
      'Teamwork',
    ],
  },
  { title: 'Languages Known', items: ['English', 'Hindi'] },
]

/** The Work section pulls public repos from this account at runtime. */
export const github = {
  user: 'jayantikumari05',
  profile: 'https://github.com/jayantikumari05',
  /** repos to leave out of the grid, by exact name */
  hide: ['jayantikumari05'],
}

export type Project = {
  title: string
  summary: string
  tags: string[]
  year: string
  live?: string
  code?: string
  /** drop an image into /public and point at it, e.g. '/projects/one.jpg' */
  image?: string
}

/**
 * Manual entries. These render first, ahead of the GitHub repos, so anything
 * worth pinning goes here. Leave the array empty to show only GitHub.
 */
export const projects: Project[] = []

export const socials = [
  { label: 'GitHub', href: 'https://github.com/jayantikumari05' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jayanti-kumari-2030462a0' },
]

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]
