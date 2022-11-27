import Select from "react-select";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Category from "../../models/Category";
import QuizAccess from "../../enums/QuizAccess";
import { useNavigate, useParams } from "react-router-dom";
import Quiz from "../../models/Quiz";
import categoriesService from "../../services/CategoriesService";
import quizesService from "../../services/QuizesService";
import RouteTemplate from "../../components/RouteTemplate";
import CenteredContainer from "../../components/CenteredContainer";

const QuizEdit = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [categories, setCategories] = useState([] as Category[]);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<{ label: string, value: number } | null>(null);
    const [selectedAccess, setSelectedAccess] = useState<{ label: string, value: string } | null>(null);

    const categoryOptions = useMemo(() => categories.map(c => ({ label: c.name, value: c.id })), [categories]);
    const accessOptions = useMemo(() => Object.keys(QuizAccess).filter(e => Number.isNaN(Number.parseInt(e))).map(o => ({ label: o, value: o })), []);

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
    }, [navigate, id]);

    const fetchCategories = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await categoriesService.get(signal);
            if (response.success) {
                setCategories(response.categories);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchQuiz(controller.signal);

        return () => controller.abort();
    }, [fetchQuiz]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    useEffect(() => {
        if (quiz == null) {
            return;
        }
        setName(quiz.name);
        setDescription(quiz.description);
        setSelectedAccess({ label: quiz.access, value: quiz.access });
        setSelectedCategory(categoryOptions.find(o => o.value === quiz.categoryId) ?? null);
    }, [quiz, categoryOptions]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.currentTarget;

        const name = target.quizName.value;
        const description = target.description.value;
        const categoryId = target.categoryId.value;
        const access = target.access.value;

        const response = await quizesService.update(id, name, description, categoryId, access); 

        if (response.success) {   
            navigate(`/quizes/${response.quiz!.id}`);
        } else {
            setError(response.message);
        }
    }

    return (
        <RouteTemplate>
            <CenteredContainer>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="form-group text-center">
                        <span className="text-danger">{error}</span>
                    </div>
                    <div className="form-group row mr-0">
                        <label className="col-4 col-form-label" htmlFor="quizName">Name</label>
                        <input className="col-8 form-control" maxLength={64} title="Name" name="quizName" type="text" required value={name} onChange={e => setName(e.currentTarget.value)}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea className="form-control" maxLength={256} title="Description" name="description" required value={description} onChange={e => setDescription(e.currentTarget.value)}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label" htmlFor="categoryId">Category</label>
                        <Select className="col-8" name="categoryId" required options={categoryOptions} value={selectedCategory} onChange={e => setSelectedCategory(e)}/>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label" htmlFor="access">Access</label>
                        <Select className="col-8" name="access" required options={accessOptions} value={selectedAccess} onChange={e => setSelectedAccess(e)}/>
                    </div>
                    <div className="form-group text-center">
                        <button className="btn btn-success" type="submit">Update quiz</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default QuizEdit;