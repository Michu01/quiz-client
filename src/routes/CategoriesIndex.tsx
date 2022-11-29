import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteTemplate from "../components/RouteTemplate";
import Category from "../models/Category";
import User from "../models/User";
import authService from "../services/AuthService";
import categoriesService from "../services/CategoriesService";
import usersService from "../services/UsersService";

const CategoriesIndex = () => {
    const isSignedIn = authService.isSignedIn();

    const [error, setError] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState([] as Category[]);

    const navigate = useNavigate();

    const fetchMe = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.getMe(signal);
            if (response.success) {
                setUser(response.user);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

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
        if (!isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate]);

    useEffect(() => {
        if (user != null && user.role !== "Admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchMe]);

    useEffect(() => {
        const controller = new AbortController();

        fetchCategories(controller.signal);

        return () => controller.abort();
    }, [fetchCategories]);

    async function deleteCategory(category: Category) {
        const response = await categoriesService.delete(category.id);
        if (response.success) {
            setCategories(categories => categories.filter(c => c.id !== category.id));
        } else {
            console.error(response.message);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const name = event.currentTarget.categoryName.value;
        event.currentTarget.categoryName.value = '';

        const response = await categoriesService.create(name);

        if (response.success) {
            setCategories(categories => [ ...categories, response.category!]);
        } else {
            setError(response.message);
        }
    }

    return (
        <RouteTemplate>
            <div className="container">
                <div className="row my-2">
                    <div className="col"/>
                    <div className="d-flex flex-row justify-content-center col bg-white rounded p-3">
                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group text-center">
                                <span className="form-text text-danger">{error}</span>
                            </div>
                            <div className="form-group row">
                                <label className="col-4 col-form-label" htmlFor="categoryName">Name</label>
                                <input className="col-8 form-control" type="text" name="categoryName" title="Category name" placeholder="Input category name..."/>
                            </div>
                            <div className="row justify-content-center">
                                <button className="btn btn-success" type="submit">Add category</button>
                            </div>
                        </form>
                    </div>
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
        </RouteTemplate>
    );
}

export default CategoriesIndex;