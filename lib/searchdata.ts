export const AllContent = [
  { id: 1, type: 'thread', title: 'Internship vacancies in tech companies', category: 'Career Info', author: 'Ahmad Rahman', description: 'Some of the latest internship vacancies for IT students, suitable for beginners.' },
  { id: 2, type: 'thread', title: 'Recommended hangout spots in Jakarta', category: 'Hobbies & Entertainment', author: 'Sarah Kim', description: 'A list of cafes with fast Wi-Fi and a comfortable atmosphere for work or just relaxing.' },
  { id: 3, type: 'thread', title: 'Effective study tips for semester exams', category: 'Academics', author: 'David Chen', description: 'Study methods proven to increase grades and reduce stress.' },
  { id: 4, type: 'thread', title: 'How to make a simple robot from recycled materials', category: 'Hobbies & Entertainment', author: 'Tech Mentor', description: 'A step-by-step guide for a DIY robotics project.' },
  { id: 5, type: 'thread', title: 'Scholarships abroad in 2025', category: 'Career Info', author: 'Code Guru', description: 'Complete information about fully-funded scholarships in various countries.' },
  { id: 6, type: 'thread', title: 'Q&A forum about final projects', category: 'Academics', author: 'Student Helper', description: 'A discussion space to help students complete their theses.' },
  { id: 7, type: 'thread', title: 'JavaScript vs Python: Which should beginners learn first?', category: 'Programming', author: 'Tech Mentor', description: 'A deep dive into the pros and cons of each language for newcomers.' }
];

export const categories = [
  'Programming',
  'Hobbies & Entertainment',
  'Career Info',
  'Academics',
  'Design',
  'Marketing',
  'Data Science',
  'Cybersecurity'
];
export const popularSearch = [
  'Internship vacancies',
  'Study tips',
  'Scholarships abroad',
  'DIY robotics',
  'JavaScript vs Python'
];

// --- FUNGSI SIMULASI FETCH ---
export const fetchResults = async (query: string) => {
  console.log(`Mencari data untuk: ${query}`);
  
  // Simulasi delay API
  await new Promise(resolve => setTimeout(resolve, 500)); 

  if (!query) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();
  
  const results = AllContent.filter(content => 
    content.title.toLowerCase().includes(lowerCaseQuery) ||// Pencarian di Title
    content.description.toLowerCase().includes(lowerCaseQuery) || // Pencarian di Description
    content.category.toLowerCase().includes(lowerCaseQuery) || // Pencarian di Category
    content.author.toLowerCase().includes(lowerCaseQuery)     // Pencarian di Author
  );

  return results;
};