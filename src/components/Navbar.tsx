import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {


    return (
    <nav className="navbar d-flex w-100">
        <Link className="navbar-element h3 my-auto mx-5" to="/">QuizApp</Link>
        <Link className="navbar-element h5 my-auto ml-auto mr-3" to="/signIn">Sign In</Link>
    </nav>
    );
}

export default Navbar;