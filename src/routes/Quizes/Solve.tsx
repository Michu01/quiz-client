import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/QuestionCard";
import RouteTemplate from "../../components/RouteTemplate";
import VerticallyCenteredContainer from "../../components/VerticallyCenteredContainer";
import Answer from "../../enums/Answer";
import Question from "../../models/Question";
import quizesService from "../../services/QuizesService";

const QuizSolve = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [questions, setQuestions] = useState([] as Question[]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState<Answer | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const scoreRef = useRef(0);

    const navigate = useNavigate();
    
    const fetchQuestions = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await quizesService.getQuestions(id, signal);
            if (response.success) {
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

    useEffect(() => {
        if (answer == null) {
            return;
        }

        if (answer === Answer[questions[index].correctAnswer.toString() as keyof typeof Answer]) {
            ++scoreRef.current;
        }
    }, [answer, questions, index]);

    function handleClick() {
        if (isFinished || answer == null) {
            return;
        }

        setAnswer(null);

        if (index + 1 === questions.length) {
            setIsFinished(true);
            return;
        }

        setIndex(index => index + 1);
    }

    return (
        <RouteTemplate>
             <VerticallyCenteredContainer>
                <div className="min-w-75 min-h-50 d-flex flex-column justify-content-between opaque-white rounded p-3" onClick={handleClick}>
                {
                    questions.length === 0 ?
                    <>
                        <div/>
                        <div className="text-center">
                            <h3>No questions!</h3>
                            <button className="btn btn-primary m-1" onClick={ () => navigate(-1) }>Go back</button>
                        </div>
                        <div/>
                    </>
                    :
                    <>
                    {
                        isFinished ?
                        <>
                            <div/>
                            <div className="text-center">
                                <h4>Congratulations!</h4>
                                <h5>Your score is: {scoreRef.current} / {questions.length}</h5>
                            </div>
                            <div/>
                        </> :
                        <>
                            <div className="text-center">
                                <h5 className={ answer == null ? "invisible" : "visible" }>Click anywhere to continue</h5>
                            </div>
                            <QuestionCard question={ questions[index] } userAnswer={answer} setUserAnswer={ setAnswer }/>
                            <div className="text-center">
                                <h5>Question: {index + 1} / {questions.length}</h5>
                            </div>
                        </>
                    }
                    </>
                }
                </div>
            </VerticallyCenteredContainer>
        </RouteTemplate>
    );
}

export default QuizSolve;