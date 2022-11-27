import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import Category from "../../models/Category";
import Quiz from "../../models/Quiz";
import User from "../../models/User";
import authService from "../../services/AuthService";
import categoriesService from "../../services/CategoriesService";
import quizesService from "../../services/QuizesService";
import usersService from "../../services/UsersService";

const QuizDetails = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [creator, setCreator] = useState<User | null>(null);
    const [me, setMe] = useState<User | null>(null);

    const navigate = useNavigate();

    const fetchMe = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.getMe(signal);
            if (response.success) {
                setMe(response.user);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

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

    useEffect(() => {
        if (!authService.isSignedIn()) {
            return;
        }

        const controller = new AbortController();

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [fetchMe]);

    async function deleteQuiz() {
        const response = await quizesService.delete(id);
        if (response.success) {
            navigate('/quizes');
        } else {
            console.error(response.message);
        }
    }

    return (
        <RouteTemplate>
            <CenteredContainer>
            {
                quiz != null && 
                <>
                    <dl>
                        <div className="row">
                            <dt className="col text-left">Name</dt>
                            <dd className="col text-right">{ quiz.name }</dd>
                        </div>
                        <div>
                            <dt className="text-left">Description</dt>
                            <dd className="text-left">{ quiz.description }</dd>
                        </div>
                        <div className="row">
                            <dt className="col text-left">Category</dt>
                            <dd className="col text-right">{ category != null && <Link to={`/quizes?categoryId=${category.id}`}>{category.name}</Link> }</dd>
                        </div>
                        <div className="row">
                            <dt className="col text-left">Creator</dt>
                            <dd className="col text-right">{ creator != null && <Link to={`/users/${creator.id}`}>{creator.name}</Link> }</dd>
                        </div>
                        <div className="row">
                            <dt className="col text-left">Access</dt>
                            <dd className="col text-right">{ quiz.access }</dd>
                        </div>
                    </dl>
                    <div className="d-flex flex-row justify-content-center">
                        <Link className="btn btn-success mx-1" to={`/quizes/${quiz.id}/solve`}>Solve</Link>
                        {
                            me != null && (me.role === "Admin" || (quiz != null && me.id === quiz.creatorId)) &&
                            <>
                                <Link className="btn btn-primary mx-1" to={`/quizes/${quiz.id}/edit`}>Edit</Link>
                                <Link className="btn btn-primary mx-1" to={`/quizes/${quiz.id}/editQuestions`}>Edit questions</Link>
                                <button className="btn btn-danger mx-1" onClick={deleteQuiz}>Delete</button>
                            </>
                        }
                    </div>
                </>
            }
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default QuizDetails;