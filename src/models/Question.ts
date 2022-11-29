import Answer from "../enums/Answer";

export default class Question {
    id: number | null = null;
    contents = "";
    answerA = "";
    answerB = "";
    answerC = "";
    answerD = "";
    correctAnswer = Answer.A;
}