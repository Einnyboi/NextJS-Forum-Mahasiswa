export interface HistoryItem {
    id: number;
    title: string;
    type: string;
    category: string;
    content: string; // Properti yang dicari di baris 85
    date: Date;     // Kunci untuk getTime() dan toLocaleDateString()
    likes: number;
    replies: number;
    url: string; // Properti yang dicari di baris 77
}
export const historyData :HistoryItem[]= [
  {
    id: 1,
    title: "[REVIEW] Introduction to Visual Communication Design (DKV)",
    type: "Created a thread",
    category: "Academics",
    content: "Hello everyone! Just wanted to share a little review of the Visual Communication Design introductory course this semester. The lecturer is really cool and the assignments are fun, especially the final project...",
    date: new Date("2025-05-02"), 
    likes: 35,
    replies: 10, 
    url: "#"
  },
  {
    id: 2,
    title: "Re: Internship Vacancy at PT. Pertamina",
    type: "Replied to a thread",
    category: "Career Info",
    content: "Wow, what a coincidence, I also applied there. Have you received a call for an interview yet?",
    date: new Date("2025-01-19"),
    likes: 250,
    replies: 30,
    url: "#"
  },
  {
    id: 3,
    title: "Re: Drakor Recommendation: Resident Playbook (2025) - A Must-Watch!",
    type: "Replied to a thread",
    category: "Hobbies",
    content: "I totally agree! I think this drama is more than just entertainment, it has so many life lessons...",
    date: new Date("2025-09-27"),
    likes: 300,
    replies: 28,
    url: "#"
  },
];