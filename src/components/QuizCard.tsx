import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Category from "../models/Category";
import Quiz from "../models/Quiz";
import User from "../models/User";
import quizService from "../services/QuizService";

const QuizCard = ({ quiz }: { quiz: Quiz }) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [creator, setCreator] = useState<User | null>(null);

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

        fetchCategory(controller.signal);

        return () => controller.abort();
    }, [fetchCategory]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCreator(controller.signal);

        return () => controller.abort();
    }, [fetchCreator]);

    return (
        <div className="card m-2">
            <div className="card-body">
                <h5>{ quiz.name }</h5>
                <p>{ quiz.description }</p>
                <dl>
                    <div className="row">
                        <dt className="col">Access</dt>
                        <dd className="col text-right">{ quiz.access }</dd>
                    </div>
                    <div className="row">
                        <dt className="col">Category</dt>
                        <dd className="col text-right">{ category && category.name }</dd>
                    </div>
                    <div className="row">
                        <dt className="col">Creator</dt>
                        <dd className="col text-right">{ creator && <Link to={ `/users/${ creator.id }` }>{ creator.name }</Link> }</dd>
                    </div>
                </dl>
                <div className="d-flex flex-row justify-content-center">
                    <Link className="btn btn-success mx-1" to={ `/quizes/${ quiz.id }/solve` }>Solve</Link>
                    <Link className="btn btn-primary mx-1" to={ `/quizes/${ quiz.id }` }>Details</Link>
                </div>
            </div>
        </div>
    );
}

export default QuizCard;