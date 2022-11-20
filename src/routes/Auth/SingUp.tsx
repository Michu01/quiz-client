import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import quizService from "../../services/QuizService";

const AuthSignUp = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const login = event.currentTarget.login.value;
        const password = event.currentTarget.password.value;
        const response = await quizService.signUp(login, password);
        if (!response.ok) {
            const error = await response.text();
            setError(error);
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        if (quizService.isSignedIn()) {
            navigate("/");
        }
    });

    return (
    <>
        <Navbar/>
        <div className="container">
            <div className="row">
                <div className="col"></div>
                <form className="col" onSubmit={e => handleSubmit(e)}>
                    <div className="text-center">
                        <span className="form-text text-danger">{error}</span>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label" htmlFor="login">Login</label>
                        <input className="col-8 form-control" title="login" name="login" type="text" required></input>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 col-form-label" htmlFor="password">Password</label>
                        <input className="col-8 form-control" title="password" name="password" type="password" required></input>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Sign Up</button>
                    </div>
                </form>
                <div className="col"></div>
            </div>
        </div>
    </>
    );
}

export default AuthSignUp;