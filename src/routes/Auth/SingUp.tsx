import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import authService from "../../services/AuthService";

const AuthSignUp = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const login = event.currentTarget.login.value;
        const password = event.currentTarget.password.value;
        const response = await authService.signUp(login, password);

        if (response.success) {
            navigate("/");
        } else {
            setError(response.message);
        }
    }

    useEffect(() => {
        if (authService.isSignedIn()) {
            navigate("/");
        }
    });

    return (
        <RouteTemplate>
            <CenteredContainer>
                <form className="p-3" onSubmit={e => handleSubmit(e)}>
                    <div className="form-group text-center">
                        <span className="form-text text-danger">{error}</span>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 text-left col-form-label" htmlFor="login">Login</label>
                        <input className="col-8 form-control" title="login" name="login" type="text" required></input>
                    </div>
                    <div className="form-group row">
                        <label className="col-4 text-left col-form-label" htmlFor="password">Password</label>
                        <input className="col-8 form-control" title="password" name="password" type="password" required></input>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Sign Up</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default AuthSignUp;