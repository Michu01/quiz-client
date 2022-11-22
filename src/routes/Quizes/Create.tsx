import Navbar from "../../components/Navbar";
import Select from "react-select";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Category from "../../models/Category";
import quizService from "../../services/QuizService";
import QuizAccess from "../../enums/QuizAccess";
import { useNavigate } from "react-router-dom";
import Quiz from "../../models/Quiz";

const QuizCreate = () => {
    const [categories, setCategories] = useState([] as Category[]);
    const [error, setError] = useState("");

    const categoryOptions = useMemo(() => categories.map(c => ({ label: c.name, value: c.id })), [categories]);
    const accessOptions = useMemo(() => Object.keys(QuizAccess).filter(e => Number.isNaN(Number.parseInt(e))).map(o => ({ label: o, value: o })), []);

    const navigate = useNavigate();

    const fetchCategories = useCallback(async (signal: AbortSignal) => {
        try {
            const categories = await quizService.getCategories(signal);
            setCategories(categories);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.currentTarget;

        const name = target.quizName.value;
        const description = target.description.value;
        const categoryId = target.categoryId.value;
        const access = target.access.value;

        const response = await quizService.createQuiz(name, description, categoryId, access); 

        if (response.ok) {
            const quiz = await response.json() as Quiz;    
            navigate(`/quizes/${quiz.id}`);
            return;
        }

        const error = await response.text();
        setError(error);
    }

    return (
        <>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col"/>
                    <form className="col my-3" onSubmit={e => handleSubmit(e)}>
                        <div className="form-group text-center">
                            <span className="text-danger">{error}</span>
                        </div>
                        <div className="form-group row mr-0">
                            <label className="col-4 col-form-label" htmlFor="quizName">Name</label>
                            <input className="col-8 form-control" maxLength={64} title="Name" name="quizName" type="text" required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea className="form-control" maxLength={256} title="Description" name="description" required/>
                        </div>
                        <div className="form-group row">
                            <label className="col-4 col-form-label" htmlFor="categoryId">Category</label>
                            <Select className="col-8" name="categoryId" required options={categoryOptions}/>
                        </div>
                        <div className="form-group row">
                            <label className="col-4 col-form-label" htmlFor="access">Access</label>
                            <Select className="col-8" name="access" required options={accessOptions} defaultValue={accessOptions[0]}/>
                        </div>
                        <div className="form-group text-center">
                            <button className="btn btn-success" type="submit">Create quiz</button>
                        </div>
                    </form>
                    <div className="col"/>
                </div>
            </div>
        </>
    );
}

export default QuizCreate;