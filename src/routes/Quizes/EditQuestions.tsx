import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionEditCard from "../../components/QuestionEditCard";
import RouteTemplate from "../../components/RouteTemplate";
import VerticallyCenteredContainer from "../../components/VerticallyCenteredContainer";
import Question from "../../models/Question";
import questionsService from "../../services/QuestionsService";
import quizesService from "../../services/QuizesService";

const QuizEditQuestions = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [questions, setQuestions] = useState([] as Question[]);
    const [index, setIndex] = useState(0);
    const [error, setError] = useState("");

    const fetchQuestions = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await quizesService.getQuestions(id, signal);
            if (response.success) {
                if (response.questions.length === 0) {
                    response.questions.push(new Question());
                }
                setQuestions(response.questions);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        
        fetchQuestions(controller.signal);

        return () => controller.abort();
    }, [fetchQuestions]);

    function previous() {
        if (index >= 1) {
            setIndex(index => index - 1);
        }
    }

    function next() {
        if (index + 1 === questions.length) {
            questions.push(new Question());
        }

        setIndex(index => index + 1); 
    }

    function deleteQuestion() {
        setQuestions(questions => {
            questions = questions.filter(q => q !== questions[index]);
            if (questions.length === 0) {
                questions.push(new Question());
            }
            return questions;
        });
        if (index !== 0) {
            setIndex(index => index - 1);
        }
    }

    async function saveChanges() {
        for (let i = 0; i !== questions.length; ++i) {
            const question = questions[i];
            const response = question.id == null ?
                await quizesService.createQuestion(id, question.contents, question.answerA, question.answerB, question.answerC, question.answerD, question.correctAnswer) :
                await questionsService.update(question.id, question.contents, question.answerA, question.answerB, question.answerC, question.answerD, question.correctAnswer);
            if (!response.success) {
                setIndex(i);
                setError(response.message);
                return;
            }
        }
    }

    function setQuestion(question: Question) {
        setQuestions(questions => questions.map(q => q === questions[index] ? question : q));
    }

    return (
        <RouteTemplate>
            <VerticallyCenteredContainer>
                <div className="min-w-75 min-h-50 d-flex flex-column justify-content-center text-center opaque-white rounded p-3">
                    <span className="text-danger m-1">{error}</span>
                    <div className="d-flex flex-row align-items-center m-1">
                        <div className="col-2">
                            { index >= 1 && <button className="btn btn-primary" type="button" onClick={previous}>Previous</button> }
                        </div>
                        <div className="col-8 d-flex flex-column align-items-center">
                            { questions.length !== 0 && <QuestionEditCard question={ questions[index] } setQuestion={ setQuestion }/> }
                            <button className="btn btn-danger" type="button" onClick={deleteQuestion}>Delete question</button>
                        </div>
                        <div className="col-2">
                            <button className="btn btn-primary text-nowrap" type="button" onClick={next}>{ index + 1 === questions.length ? "Add question" : "Next" }</button>
                        </div>
                    </div>
                    <div className="text-center m-1">
                        <button className="btn btn-success" type="button" onClick={saveChanges}>Save changes</button>
                    </div>
                </div>
            </VerticallyCenteredContainer>
        </RouteTemplate>
    );
}

export default QuizEditQuestions;