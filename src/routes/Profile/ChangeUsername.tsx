import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import authService from "../../services/AuthService";

const ProfileChangeUsername = () => {
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;
        const response = await authService.changeUsername(username, password);
        if (response.success) {
            navigate("/profile");
        } else {
            setError(response.message);
        }
    }

    useEffect(() => {
        if (!authService.isSignedIn()) {
            navigate("/auth/signIn");
        }
    }, [navigate]);

    return (
        <RouteTemplate>
            <CenteredContainer>
                <form className="p-3" onSubmit={e => handleSubmit(e)}>
                    <div className="form-group text-center">
                        <span className="form-text text-danger">{error}</span>
                    </div>
                    <div className="form-group row">
                        <label className="col col-form-label text-left" htmlFor="username">New username</label>
                        <input className="col form-control" title="Username" name="username" type="text" required></input>
                    </div>
                    <div className="form-group row">
                        <label className="col col-form-label text-left" htmlFor="password">Password</label>
                        <input className="col form-control" title="Password" name="password" type="password" required></input>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Change username</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default ProfileChangeUsername;