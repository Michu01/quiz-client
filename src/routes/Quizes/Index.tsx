import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Category from "../../models/Category";
import quizService from "../../services/QuizService";

const QuizIndex = () => {
    const [categories, setCategories] = useState([] as Category[]);

    const categorySelect = useRef<HTMLSelectElement>(null);

    const fetchCategories = useCallback(async (signal: AbortSignal) => {
        try {
            const categories = await quizService.getCategories(signal);
            setCategories(categories);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            }
            throw e;
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {

    }

    return (
    <>
        <Navbar/>
        <div className="d-flex flex-row">
            <form className="col-2" onSubmit={e => handleSubmit(e)}>
                <input className="form-control" type="search" name="namePattern" placeholder="Input quiz name..."></input>
                <select ref={categorySelect}>
                    <option value="">-</option>
                {
                    categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                }
                </select>
                <button className="btn btn-primary" type="submit">Search</button>
            </form>
            <div className="col-8">

            </div>
            <div className="col-2"/>
        </div>
    </>
    );
}

export default QuizIndex;