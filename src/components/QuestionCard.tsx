import Answer from "../enums/Answer";
import Question from "../models/Question";

const QuestionCard = ({ question, userAnswer, setUserAnswer }: { question: Question, userAnswer: Answer | null, setUserAnswer: (answer: Answer) => void }) => {
    function getStyle(answer: Answer) {
        if (userAnswer == null) {
            return "primary";
        }

        const correctAnswer = Answer[question.correctAnswer.toString() as keyof typeof Answer]

        if (answer === userAnswer && userAnswer !== correctAnswer) {
            return "danger";
        }

        if (answer === correctAnswer) {
            return "success";
        }

        return "primary";
    }

    return (
        <div>
            <div className="row d-flex flex-row justify-content-center my-2">
                <h4>{ question.contents }</h4>
            </div>
            <div className="row my-2">
                <div className="col mx-1">
                    <div className={`d-flex flex-row align-items-center border border-${ getStyle(Answer.A) } rounded ${ userAnswer == null && "hover" }`} onClick={ () => setUserAnswer(Answer.A) }>
                        <h5 className={`bg-${ getStyle(Answer.A) } mr-1 my-auto text-light p-2`}>A</h5>
                        <h5 className="mx-1 my-0">{question.answerA}</h5>
                    </div>
                </div>
                <div className="col mx-1">
                    <div className={`d-flex flex-row align-items-center border border-${ getStyle(Answer.B) } rounded ${ userAnswer == null && "hover" }`} onClick={ () => setUserAnswer(Answer.B) }>
                        <h5 className={`bg-${ getStyle(Answer.B) } mr-1 my-auto text-light p-2`}>B</h5>
                        <h5 className="mx-1 my-0">{question.answerB}</h5>
                    </div>
                </div>
            </div>
            <div className="row my-2">
                <div className="col mx-1">
                    <div className={`d-flex flex-row align-items-center border border-${ getStyle(Answer.C) } rounded ${ userAnswer == null && "hover" }`} onClick={ () => setUserAnswer(Answer.C) }>
                        <h5 className={`bg-${ getStyle(Answer.C) } mr-1 my-auto text-light p-2`}>C</h5>
                        <h5 className="mx-1 my-0">{question.answerC}</h5>
                    </div>
                </div>
                <div className="col mx-1">
                    <div className={`d-flex flex-row align-items-center border border-${ getStyle(Answer.D) } rounded ${ userAnswer == null && "hover" }`} onClick={ () => setUserAnswer(Answer.D) }>
                        <h5 className={`bg-${ getStyle(Answer.D) } mr-1 my-auto text-light p-2`}>D</h5>
                        <h5 className="mx-1 my-0">{question.answerD}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestionCard;