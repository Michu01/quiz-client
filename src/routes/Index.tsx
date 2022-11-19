import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Index = () => {

    return (
    <>
        <Navbar/>
        <div className="container">
            <h1 className="text-center my-5">Welcome to QuizApp!</h1>
            <h3 className="text-center my-3">QuizApp is a place where you can create quizes and share them with your friends</h3>
            <h4 className="text-center my-3">Are you new? <Link to="/signUp">Create an account</Link></h4>
            <h4 className="text-center my-3">Want to just look around? Check our <Link to="/quizes">public quizes</Link></h4>
        </div>
    </>
    );
}

export default Index;