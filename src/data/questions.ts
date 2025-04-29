export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "যদি $A=[[1,2],$ [3, 4]], তবে $A^{2}$ কত?",
    options: ["[[7, 10], [15, 22]]", "[[2, 4], [6, 8]]", "[[1, 0], [0, 1]]", "[[10, 14], [21, 30]]", "[[5, 6], [7, 8]]"],
    correctAnswer: "[[7, 10], [15, 22]]"
  },
  {
    id: 2,
    question: "[[3, 5], [-2, 4]] এর নির্ণায়ক কত?",
    options: ["22", "17", "6", "-22", "1"],
    correctAnswer: "22"
  },
  {
    id: 3,
    question: "A = [[2, 0], [1, 3]], তবে A¹ কত?",
    options: ["[[3/5, 0], [-1/5, 2/5]]", "[[3, 0], [-1, 2]]", "[[3/2, 0], [-1/2, 1]]", "[[3/2, 0], [1/2, 1]]", "[[3/2, 1/2], [0, 1]]"],
    correctAnswer: "[[3/2, 0], [-1/2, 1]]"
  },
];
