import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import User from "../../models/User";
import quizService from "../../services/QuizService";

const ProfileIndex = () => {
    const [avatarPath, setAvatarPath] = useState<string | null>(quizService.isSignedIn() ? null : 'defaultAvatar.png');
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const getMe = useCallback(async (signal: AbortSignal) => {
        try {
            const user = await quizService.getMe(signal);
            setUser(user);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const avatarPath = await quizService.getAvatarPath(signal) ?? 'defaultAvatar.png';
            setAvatarPath(avatarPath);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        if (!quizService.isSignedIn()) {
            navigate('/auth/signIn');
            return;
        }

        const controller = new AbortController();

        getMe(controller.signal);

        return () => controller.abort();
    }, [getMe, navigate]);

    useEffect(() => {
        if (!quizService.isSignedIn()) {
            return;
        }

        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [fetchAvatarPath]);

    return (
    <>
        <Navbar/>
        <div className="container">
            <div className="row">
                <div className="col"></div>
                <div className="col d-flex flex-column">
                {
                    user != null &&
                    <>
                        <img className="row align-self-center" height="240" alt="avatar" src={ avatarPath == null ? "" : `https://localhost:7109/${avatarPath}?lastmod=${Date.now()}`}/>
                        <h4 className="row align-self-center">{user.name}</h4>
                        <div className="row">
                            <p className="col text-left">Join date:</p>
                            <p className="col text-right">{user.joinDate.toString()}</p>
                        </div>
                        <div className="row justify-content-center">
                        <Link to="/profile/changeAvatar">Change avatar</Link>
                        </div>
                        <div className="row justify-content-center">
                            <Link to="/profile/changePassword">Change password</Link>
                        </div>
                    </>
                }
                </div>
                <div className="col"></div>
            </div>
        </div>
    </>
    );
}

export default ProfileIndex;