import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import User from "../models/User";
import quizService from "../services/QuizService";

const Navbar = () => {
    const [avatarPath, setAvatarPath] = useState<string | null>(quizService.isSignedIn() ? null : 'defaultAvatar.png');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchMe = useCallback(async (signal: AbortSignal) => {
        try {
            setIsLoading(true);
            const user = await quizService.getMe(signal);
            setUser(user);
            setIsLoading(false);
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
            return;
        }

        const controller = new AbortController();

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [fetchMe]);

    useEffect(() => {
        if (!quizService.isSignedIn()) {
            return;
        }

        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [fetchAvatarPath]);

    function signOut() {
        quizService.signOut();
        navigate("/");
        navigate(0);
    }

    return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
        <Link className="navbar-brand" to="/">QuizApp</Link>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
            {
                user == null ?
                <li className="nav-item">
                    <Link className="nav-link" to="/quizes">Quizes</Link>
                </li> :
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="/" role="button" data-toggle="dropdown">Quizes</a>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/quizes">Quiz list</Link>
                        <Link className="dropdown-item" to="/quizes/create">Create quiz</Link>
                    </div>
                </li>
            }
            {
                user != null && 
                <li className="nav-item">
                    <Link className="nav-link" to="/users">Users</Link>
                </li>
            }
            {
                user?.role === "Admin" &&
                <li className="nav-item">
                    <Link className="nav-link" to="/categories">Categories</Link>
                </li>
            }
            </ul>
        </div>
        
        <div className="ml-auto">
        { 
            isLoading ? <></> :
            user == null ?
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/signIn">Sign In</Link> 
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/signUp">Sign Up</Link>
                </li>
            </ul> :
            <div className="dropdown">
                <button className="btn btn-light btn-outline-dark dropdown-toggle" data-toggle="dropdown">
                    <span className="h4 align-middle mr-1">{user.name}</span>
                    <img className="rounded-circle ml-1" height="40" width="40" alt="avatar" src={ avatarPath == null ? "" : `https://localhost:7109/${avatarPath}?lastmod=${Date.now()}`}/>
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                    <Link className="dropdown-item" to="/friends">Friends</Link>
                    <Link className="dropdown-item" to="/quizes/my">Quizes</Link>
                    <Link className="dropdown-item" to="/" onClick={signOut}>Sign out</Link>
                </div>
            </div>
        }
        </div>
    </nav>
    );
}

export default Navbar;