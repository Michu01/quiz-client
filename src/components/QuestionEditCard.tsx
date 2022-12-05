import { useMemo } from "react";
import Select from "react-select";
import Answer from "../enums/Answer";
import Question from "../models/Question";

const QuestionCard = ({ question, setQuestion }: { question: Question, setQuestion: (question: Question) => void }) => {
    const answerOptions = useMemo(() => Object.keys(Answer).filter(e => Number.isNaN(Number.parseInt(e))).map(o => ({ label: o, value: o })), []);

    const selectedAnswer = answerOptions.find(o => o.value === question.correctAnswer.toString());

    return (
        <form>
            <div className="form-group text-center">
                <label className="form-label" htmlFor="content">Question</label>
                <textarea className="form-control" name="content" required value={question.contents} onChange={e => setQuestion({ ...question, contents: e.target.value })}/>
            </div>
            <div className="text-center">
                <label className="form-label">Answers</label>
            </div>
            <div className="row">
                <div className="col form-group row mx-1">
                    <label className="col-form-label mx-1" htmlFor="answerA">A</label>
                    <input className="col form-control mx-1" type="text" title="Answer A" name="answerA" required value={question.answerA} onChange={e => setQuestion({ ...question, answerA: e.target.value })}/>
                </div>
                <div className="col form-group row mx-1">
                    <label className="col-form-label mx-1" htmlFor="answerB">B</label>
                    <input className="col form-control mx-1" type="text" title="Answer B" name="answerB" required value={question.answerB} onChange={e => setQuestion({ ...question, answerB: e.target.value })}/>
                </div>
            </div>
            <div className="row">
                <div className="col form-group row mx-1">
                    <label className="col-form-label mx-1" htmlFor="answerC">C</label>
                    <input className="col form-control mx-1" type="text" title="Answer C" name="answerC" required value={question.answerC} onChange={e => setQuestion({ ...question, answerC: e.target.value })}/>
                </div>
                <div className="col form-group row mx-1">
                    <label className="col-form-label mx-1" htmlFor="answerD">D</label>
                    <input className="col form-control mx-1" type="text" title="Answer D" name="answerD" required value={question.answerD} onChange={e => setQuestion({ ...question, answerD: e.target.value })}/>
                </div>
            </div>
            <div className="form-group text-center">
                <label className="col-form-label" htmlFor="correctAnswer">Correct answer</label>
                <Select className="w-25 mx-auto" options={answerOptions} name="correctAnswer" required value={ selectedAnswer } onChange={e => setQuestion({ ...question, correctAnswer: Answer[e?.value as keyof typeof Answer] })}/>
            </div>
        </form>
    );
}

export default QuestionCard;