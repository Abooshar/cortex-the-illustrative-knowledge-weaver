export const graphData = {
  nodes: [
    { id: 'AI', group: 1, val: 10 },
    { id: 'Machine Learning', group: 1, val: 8 },
    { id: 'Deep Learning', group: 1, val: 6 },
    { id: 'Neural Networks', group: 1, val: 6 },
    { id: 'Programming', group: 2, val: 8 },
    { id: 'Python', group: 2, val: 6 },
    { id: 'JavaScript', group: 2, val: 6 },
    { id: 'React', group: 2, val: 4 },
    { id: 'Design', group: 3, val: 8 },
    { id: 'UI/UX', group: 3, val: 6 },
    { id: 'Figma', group: 3, val: 4 },
    { id: 'Cloud Computing', group: 4, val: 8 },
    { id: 'Cloudflare', group: 4, val: 6 },
    { id: 'Serverless', group: 4, val: 4 },
  ],
  links: [
    { source: 'AI', target: 'Machine Learning' },
    { source: 'Machine Learning', target: 'Deep Learning' },
    { source: 'Deep Learning', target: 'Neural Networks' },
    { source: 'AI', target: 'Programming' },
    { source: 'Programming', target: 'Python' },
    { source: 'Programming', target: 'JavaScript' },
    { source: 'JavaScript', target: 'React' },
    { source: 'Machine Learning', target: 'Python' },
    { source: 'Design', target: 'UI/UX' },
    { source: 'UI/UX', target: 'Figma' },
    { source: 'React', target: 'UI/UX' },
    { source: 'Cloud Computing', target: 'Serverless' },
    { source: 'Cloud Computing', target: 'Cloudflare' },
    { source: 'Serverless', target: 'Cloudflare' },
    { source: 'Programming', target: 'Cloud Computing' },
  ],
};
export interface CortexItem {
  id: string;
  title: string;
  type: 'article' | 'guide' | 'template' | 'code' | 'collection';
  status: 'published' | 'draft' | 'in_progress';
  createdAt: Date;
  keywords: string[];
}
export const cortexContent: CortexItem[] = [
  {
    id: '1',
    title: 'Intro to Neural Networks',
    type: 'article',
    status: 'published',
    createdAt: new Date('2023-10-26'),
    keywords: ['AI', 'Deep Learning', 'Guide'],
  },
  {
    id: '2',
    title: 'Cloudflare Workers Architecture',
    type: 'guide',
    status: 'published',
    createdAt: new Date('2023-11-15'),
    keywords: ['Cloudflare', 'Serverless', 'Architecture'],
  },
  {
    id: '3',
    title: 'UX Research Methods',
    type: 'template',
    status: 'draft',
    createdAt: new Date('2024-01-05'),
    keywords: ['UX', 'Research', 'Design'],
  },
  {
    id: '4',
    title: 'React State Management Snippet',
    type: 'code',
    status: 'published',
    createdAt: new Date('2023-09-01'),
    keywords: ['React', 'JavaScript', 'Zustand'],
  },
  {
    id: '5',
    title: 'AI Project Ideas',
    type: 'collection',
    status: 'draft',
    createdAt: new Date('2024-02-20'),
    keywords: ['AI', 'Ideas', 'Collection'],
  },
];
export const mockUser = {
  name: 'Alex Turing',
  email: 'alex.turing@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex-turing',
};
export const mockStats = {
  totalNodes: 14,
  contentItems: 5,
  connections: 15,
  avgConnections: 2.1,
  contentByType: {
    Articles: 1,
    Guides: 1,
    Templates: 1,
    Code: 1,
    Collections: 1,
  },
};
export const mockRoadmap = [
  {
    id: '1',
    title: 'Q3: Content Import Feature',
    description: 'Allow importing from Markdown and Notion.',
    status: 'In Progress',
    progress: 40,
  },
  {
    id: '2',
    title: 'Q2: Advanced Search Filters',
    description: 'Filter content by type, date, and keywords.',
    status: 'Completed',
    progress: 100,
  },
  {
    id: '3',
    title: 'Q3: Collaborative Spaces',
    description: 'Share and edit knowledge graphs with your team.',
    status: 'In Progress',
    progress: 15,
  },
];