export interface IQuiz {
  title: string;
  description?: string;
  numberOfQuestions: number;
  timelimit: string;
  categoryId: string;
  questions?: Array;
}
