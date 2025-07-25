export interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  quizId: string;
}

export interface IQuestionUpdate {
  question?: string;
  options?: string[];
  amswer?: string;
  
}
