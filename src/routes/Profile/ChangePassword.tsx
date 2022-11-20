import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import quizService from "../../services/QuizService";

const ProfileChangePassword = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const currentPassword = event.currentTarget.currentPassword.value;
        const newPassword = event.currentTarget.newPassword.value;
        const response = await quizService.changePassword(currentPassword, newPassword);
        if (!response.ok) {
            const error = await response.text();
            setError(error);
        } else {
            navigate("/profile");
        }
    }

    useEffect(() => {
        if (!quizService.isSignedIn()) {
            navigate("/auth/signIn");
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
                        <label className="col col-form-label" htmlFor="currentPassword">Current password</label>
                        <input className="col form-control" title="current password" name="currentPassword" type="password" required></input>
                    </div>
                    <div className="form-group row">
                        <label className="col col-form-label" htmlFor="newPassword">New password</label>
                        <input className="col form-control" title="new password" name="newPassword" type="password" required></input>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Change password</button>
                    </div>
                </form>
                <div className="col"></div>
            </div>
        </div>
    </>
    );
}

export default ProfileChangePassword;