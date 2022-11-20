import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import quizService from "../../services/QuizService";

const ProfileChangeAvatar = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const file = event.currentTarget.avatar.files[0];
        const response = await quizService.changeAvatar(file);
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
                    <div className="form-group">
                        <input className="col form-control" title="avatar" name="avatar" type="file" required/>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Change avatar</button>
                    </div>
                </form>
                <div className="col"></div>
            </div>
        </div>
    </>
    );
}

export default ProfileChangeAvatar;