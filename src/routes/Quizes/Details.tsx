import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Category from "../../models/Category";
import Quiz from "../../models/Quiz";
import User from "../../models/User";
import categoriesService from "../../services/CategoriesService";
import quizesService from "../../services/QuizesService";
import usersService from "../../services/UsersService";

const QuizDetails = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [creator, setCreator] = useState<User | null>(null);

    const navigate = useNavigate();

    const fetchQuiz = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await quizesService.find(id, signal);
            if (response.success) {
                setQuiz(response.quiz);
            } else {
                navigate("/quizes");
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id, navigate]);

    const fetchCategory = useCallback(async (signal: AbortSignal) => {
        try {
            if (quiz == null) {
                return;
            }
            const response = await categoriesService.find(quiz.categoryId, signal);
            if (response.success) {
                setCategory(response.category);
            } else {
                console.error(response.message);
            }
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
            const response = await usersService.find(quiz.creatorId, signal);
            if (response.success) {
                setCreator(response.user);
            } else {
                console.error(response.message);
            }
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
        const response = await quizesService.delete(id);
        if (response.success) {
            navigate('/quizes');
        } else {
            console.error(response.message);
        }
    }

    return (
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
    );
}

export default QuizDetails;