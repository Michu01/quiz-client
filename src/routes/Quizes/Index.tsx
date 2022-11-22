import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from 'react-select';
import Navbar from "../../components/Navbar";
import QuizCard from "../../components/QuizCard";
import QuizCreatorFilter from "../../enums/QuizCreatorFilter";
import Category from "../../models/Category";
import Quiz from "../../models/Quiz";
import quizService from "../../services/QuizService";

const QuizIndex = () => {
    const [searchParams] = useSearchParams();

    const namePattern = searchParams.get('namePattern');
    const categoryId = searchParams.get('categoryId');
    const creatorFilter = searchParams.get('creatorFilter');

    const [categories, setCategories] = useState([] as Category[]);
    const [quizes, setQuizes] = useState([] as Quiz[]);
    const [selectedCategory, setSelectedCategory] = useState<{ label: string, value: number } | null>(null);
    const [selectedCreatorFilter, setSelectedCreatorFilter] = useState<{ label: string, value: string } | null>(null);

    const categoryOptions = useMemo(() => categories.map(c => ({ label: c.name, value: c.id })), [categories]);
    const creatorFilterOptions = useMemo(() => Object.keys(QuizCreatorFilter).filter(e => Number.isNaN(Number.parseInt(e))).map(o => ({ label: o, value: o })), []);
    const quizList = useMemo(() => quizes.map(quiz => <QuizCard key={quiz.id} quiz={quiz}/>), [quizes]);

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

    const fetchQuizes = useCallback(async (signal: AbortSignal) => {
        try {
            const quizes = await quizService.getQuizes(namePattern, categoryId, creatorFilter, signal);
            setQuizes(quizes);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [namePattern, categoryId, creatorFilter]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    useEffect(() => {
        const controller = new AbortController();

        fetchQuizes(controller.signal);

        return () => controller.abort();
    }, [fetchQuizes]);

    useEffect(() => {
        const option = categoryOptions.find(o => o.value.toString() === categoryId);
        setSelectedCategory(option ?? null);
    }, [categoryOptions, categoryId]);

    useEffect(() => {
        const option = creatorFilterOptions.find(o => o.value === creatorFilter);
        setSelectedCreatorFilter(option ?? null);
    }, [creatorFilter, creatorFilterOptions]);

    return (
    <>
        <Navbar/>
        <div className="d-flex flex-row">
            <form className="col-2">
                <div className="form-group row px-1">
                    <input className="form-control" type="search" name="namePattern" title="Name pattern" placeholder="Input quiz name..." defaultValue={namePattern ?? ''}/>
                </div>
                <div className="form-group row px-1">
                    <label className="col-4 px-0 col-form-label" htmlFor="categoryId">Category</label>
                    <Select className="col-8 px-0" name="categoryId" isClearable options={categoryOptions} value={selectedCategory} onChange={e => setSelectedCategory(e)}/>
                </div>
                <div className="form-group row px-1">
                    <label className="col-4 px-0 col-form-label" htmlFor="creatorFilter">Creator filter</label>
                    <Select className="col-8 px-0" name="creatorFilter" isClearable options={creatorFilterOptions} value={selectedCreatorFilter} onChange={e => setSelectedCreatorFilter(e)}/>
                </div>
                <div className="form-group row px-1">
                    <button className="col btn btn-primary" type="submit">Search</button>
                </div>
            </form>
            <div className="col-1"/>
            <div className="col-6 d-flex flex-row">
                { quizList }
            </div>
            <div className="col-3"/>
        </div>
    </>
    );
}

export default QuizIndex;