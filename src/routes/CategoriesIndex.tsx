import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Category from "../models/Category";
import User from "../models/User";
import quizService from "../services/QuizService";

const CategoriesIndex = () => {
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState([] as Category[]);

    const navigate = useNavigate();

    const fetchMe = useCallback(async (signal: AbortSignal) => {
        try {
            const user = await quizService.getMe(signal);
            setUser(user);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

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

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [fetchMe]);

    useEffect(() => {
        if (user != null && user.role !== "Admin") {
            navigate("/");
        }
    }, [navigate, user]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    async function deleteCategory(category: Category) {
        const { ok } = await quizService.deleteCategory(category.id);

        if (ok) {
            setCategories(categories => categories.filter(c => c.id !== category.id));
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const name = event.currentTarget.categoryName.value;
        event.currentTarget.categoryName.value = '';

        const response = await quizService.addCategory(name);

        if (response.ok) {
            const category = await response.json() as Category;
            setCategories(categories => [ ...categories, category]);
        }
    }

    return (
        <>
            <Navbar/>
        {
            user != null &&
            <div className="container">
                <div className="row my-2">
                    <div className="col"/>
                    <form className="col" onSubmit={e => handleSubmit(e)}>
                        <div className="form-group row">
                            <label className="col col-form-label" htmlFor="categoryName">Name</label>
                            <input className="col form-control" type="text" name="categoryName"/>
                        </div>
                        <div className="row justify-content-center">
                            <button className="btn btn-success" type="submit">Add category</button>
                        </div>
                    </form>
                    <div className="col"/>
                </div>
                <div className="row my-2 justify-content-center">
                {
                    categories.map(c => 
                    <div key={c.id} className="card m-2">
                        <div className="card-body d-flex flex-row">
                            <h5 className="my-auto mx-1">{c.name}</h5>
                            <button className="btn btn-danger mx-1" onClick={() => deleteCategory(c)}>Delete</button>
                        </div>
                    </div>)
                }
                </div>
            </div>
        }
        </>
    );
}

export default CategoriesIndex;