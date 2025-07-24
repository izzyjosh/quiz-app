export interface IQuiz {
  title: string;
  description?: string;
  numberOfQuestions: Number;
  timelimit: string;
  categoryId: string;
  questions?: Array;
}
