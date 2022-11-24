import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import authService from "../../services/AuthService";

const AuthSignIn = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const login = event.currentTarget.login.value;
        const password = event.currentTarget.password.value;
        const response = await authService.signIn(login, password);
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
                <div className="text-center mb-1">
                    <h5>Accounts for testing purposes</h5>
                    <h5>Administrator account</h5>
                    <h6>Login: Admin</h6>
                    <h6>Password: admin</h6>
                    <h5>User account</h5>
                    <h6>Login: User</h6>
                    <h6>Password: user</h6>
                </div>
                <form className="mt-1" onSubmit={e => handleSubmit(e)}>
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
                        <button className="btn btn-primary" type="submit">Sign In</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default AuthSignIn;