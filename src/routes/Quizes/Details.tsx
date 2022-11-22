import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Category from "../../models/Category";
import Quiz from "../../models/Quiz";
import User from "../../models/User";
import quizService from "../../services/QuizService";

const QuizDetails = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [creator, setCreator] = useState<User | null>(null);

    const navigate = useNavigate();

    const fetchQuiz = useCallback(async (signal: AbortSignal) => {
        try {
            const quiz = await quizService.getQuiz(id, signal);
            setQuiz(quiz);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id]);

    const fetchCategory = useCallback(async (signal: AbortSignal) => {
        try {
            if (quiz == null) {
                return;
            }

            const category = await quizService.getCategory(quiz.categoryId, signal);
            setCategory(category);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [quiz]);

    const fetchCreator = useCallback(async (signal: AbortSignal) => {
        try {
            if (quiz == null) {
                return;
            }

            const creator = await quizService.getUser(quiz.creatorId, signal);
            setCreator(creator);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [quiz]);

    useEffect(() => {
        const controller = new AbortController();

        fetchQuiz(controller.signal);

        return () => controller.abort();
    }, [fetchQuiz]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategory(controller.signal);

        return () => controller.abort();
    }, [fetchCategory]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCreator(controller.signal);

        return () => controller.abort();
    }, [fetchCreator]);

    async function deleteQuiz() {
        const response = await quizService.deleteQuiz(id);

        if (response.ok) {
            navigate('/quizes');
        }
    }

    return (
    <>
        <Navbar/>
        <div className="container">
            <div className="row">
                <div className="col"/>
                <div className="col">
                {
                    quiz != null && 
                    <div className="d-flex flex-column">
                        <dl>
                            <div className="row">
                                <dt className="col">Name</dt>
                                <dd className="col text-right">{ quiz.name }</dd>
                            </div>
                            <div>
                                <dt>Description</dt>
                                <dd>{ quiz.description }</dd>
                            </div>
                            <div className="row">
                                <dt className="col">Category</dt>
                                <dd className="col text-right">{ category != null && <Link to={`/quizes?categoryId=${category.id}`}>{category.name}</Link> }</dd>
                            </div>
                            <div className="row">
                                <dt className="col">Creator</dt>
                                <dd className="col text-right">{ creator != null && <Link to={`/users/${creator.id}`}>{creator.name}</Link> }</dd>
                            </div>
                            <div className="row">
                                <dt className="col">Access</dt>
                                <dd className="col text-right">{ quiz.access }</dd>
                            </div>
                        </dl>
                        <div className="d-flex flex-row justify-content-center">
                            <Link className="btn btn-success mx-1" to={`/quizes/${quiz.id}/solve`}>Solve</Link>
                            <Link className="btn btn-primary mx-1" to={`/quizes/${quiz.id}/edit`}>Edit</Link>
                            <Link className="btn btn-primary mx-1" to={`/quizes/${quiz.id}/editQuestions`}>Edit questions</Link>
                            <button className="btn btn-danger mx-1" onClick={deleteQuiz}>Delete</button>
                        </div>
                        
                    </div>
                }
                </div>
                <div className="col"/>
            </div>
        </div>
        
    </>
    );
}

export default QuizDetails;