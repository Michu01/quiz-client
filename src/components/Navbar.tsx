import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import User from "../models/User";
import authService from "../services/AuthService";
import avatarsService from "../services/AvatarsService";
import usersService from "../services/UsersService";

const Navbar = () => {
    const isSignedIn = authService.isSignedIn();

    const [avatarPath, setAvatarPath] = useState<string>('defaultAvatar.png');
    const [user, setUser] = useState<User | null>(null);

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

    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await avatarsService.getPath(signal);
            if (response.success) {
                setAvatarPath(`https://localhost:7109/${response.path}?lastmod=${Date.now()}`);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchMe]);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchAvatarPath]);

    function signOut() {
        authService.signOut();
        navigate("/");
        navigate(0);
    }

    return (
        <nav className="h-100 navbar navbar-expand-md navbar-light bg-light pl-3 pr-2">
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
                    <li className="nav-item">
                        <Link className="nav-link" to="/users">Users</Link>
                    </li>    
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
                !isSignedIn &&
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/auth/signIn">Sign In</Link> 
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/auth/signUp">Sign Up</Link>
                    </li>
                </ul>
            }
            {
                isSignedIn && user != null &&
                <div className="dropdown">
                    <button className="btn btn-light btn-outline-dark dropdown-toggle" data-toggle="dropdown">
                        <span className="h4 align-middle mr-1">{user.name}</span>
                        <img className="rounded-circle ml-1 object-fit-cover" height="40" width="40" alt="avatar" src={ avatarPath }/>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <Link className="dropdown-item" to="/users?friendsOnly=on">Friends</Link>
                        <Link className="dropdown-item" to="/friendshipRequests">Friendship requests</Link>
                        <Link className="dropdown-item" to="/quizes?creatorFilter=me">Quizes</Link>
                        <Link className="dropdown-item" to="/" onClick={signOut}>Sign out</Link>
                    </div>
                </div>
            }
            </div>
        </nav>
    );
}

export default Navbar;