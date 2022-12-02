import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RouteTemplate from "../components/RouteTemplate";
import VerticallyCenteredContainer from "../components/VerticallyCenteredContainer";
import User from "../models/User";
import authService from "../services/AuthService";
import usersService from "../services/UsersService";

const Index = () => {
    const isSignedIn = authService.isSignedIn();

    const [user, setUser] = useState<User | null>(null);

    const getMe = useCallback(async (signal: AbortSignal) => {
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

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        getMe(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, getMe]);

    return (
        <RouteTemplate>
            <VerticallyCenteredContainer>
                <div className="d-flex flex-row">
                    <div className="col-2"/>
                    <div className="col-8 d-flex flex-column align-items-center text-center rounded p-3 opaque-white">
                    {
                        isSignedIn && user != null &&
                        <>
                            <h1>Welcome back, {user.name}!</h1>
                            <Link className="h3" to="/quizes">All quizes</Link>
                            <Link className="h3" to="/quizes?creatorFilter=me">My quizes</Link>
                            <Link className="h3" to="/quizes?creatorFilter=friends">Friends' quizes</Link>
                            <Link className="h3" to="/quizes/create">Create quiz</Link>
                            <Link className="h3" to="/users?friendsOnly=on">Friends</Link>
                            <Link className="h3" to="/profile">Profile</Link>
                        </>
                    }
                    {
                        !isSignedIn && 
                        <>
                            <h1>Welcome to QuizApp!</h1>
                            <h3>QuizApp is a place where you can create quizes and share them with your friends</h3>
                            <h4>Do you have an account?<Link className="mx-1" to="/auth/signIn">Sign in</Link></h4>
                            <h4>Are you new?<Link className="mx-1" to="/auth/signUp">Create an account</Link></h4>
                            <h4>Want to just look around?<Link className="mx-1" to="/quizes">Browse quizes</Link></h4>
                        </>
                    }
                    </div>
                    <div className="col-2"/>
                </div>
            </VerticallyCenteredContainer>
        </RouteTemplate>
    );
}

export default Index;