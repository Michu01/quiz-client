import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import User from "../models/User";
import quizService from "../services/QuizService";

const Index = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getMe = useCallback(async (signal: AbortSignal) => {
        try {
            const user = await quizService.getMe(signal);
            setUser(user);
            setIsLoading(false);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        if (!quizService.isSignedIn()) {
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        getMe(controller.signal);

        return () => controller.abort();
    }, [getMe]);

    return (
    <>
        <Navbar/>
        <div className="container">
        {
            isLoading ? 
            <></> :
            user != null ?
            <>
                <div className="row justify-content-center">
                    <h1 className="text-center">Welcome back, {user.name}!</h1>
                </div>
                <div className="row justify-content-center">
                    <Link className="h3 text-center" to="/quizes">All quizes</Link>
                </div>
                <div className="row justify-content-center">
                    <Link className="h3 text-center" to="/quizes/my">My quizes</Link>
                </div>
                <div className="row justify-content-center">
                    <Link className="h3 text-center" to="/friends">Friends</Link>
                </div>
                <div className="row justify-content-center">
                    <Link className="h3 text-center" to="/quizes/friends">Friends' quizes</Link>
                </div>
                <div className="row justify-content-center">
                    <Link className="h3 text-center" to="/profile">Profile</Link>
                </div>
            </> :
            <>
                <div className="row justify-content-center">
                    <h1 className="text-center">Welcome to QuizApp!</h1>
                </div>
                <div className="row justify-content-center">
                    <h3 className="text-center">QuizApp is a place where you can create quizes and share them with your friends</h3>
                </div>
                <div className="row justify-content-center">
                    <h4 className="text-center">Do you have an account?<Link className="ml-1" to="/auth/signIn">Sign in</Link></h4>
                </div>
                <div className="row justify-content-center">
                    <h4 className="text-center">Are you new?<Link className="ml-1" to="/auth/signUp">Create an account</Link></h4>
                </div>
                <div className="row justify-content-center">
                    <h4 className="text-center">Want to just look around?<Link className="ml-1" to="/quizes">Browse quizes</Link></h4>
                </div>
            </>
        }
        </div>
    </>
    );
}

export default Index;