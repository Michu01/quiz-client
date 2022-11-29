import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Index from './routes/Index';
import ProfileIndex from './routes/Profile/Index';
import QuizDetails from './routes/Quizes/Details';
import QuizIndex from './routes/Quizes/Index';
import AuthSignIn from './routes/Auth/SignIn';
import AuthSignUp from './routes/Auth/SingUp';
import UserDetails from './routes/Users/Details';
import UserIndex from './routes/Users/Index';
import ProfileChangeAvatar from './routes/Profile/ChangeAvatar';
import ProfileChangePassword from './routes/Profile/ChangePassword';
import CategoriesIndex from './routes/CategoriesIndex';
import QuizCreate from './routes/Quizes/Create';
import QuizEdit from './routes/Quizes/Edit';
import FriendshipRequests from './routes/Profile/FriendshipRequests';
import ProfileChangeUsername from './routes/Profile/ChangeUsername';
import QuizEditQuestions from './routes/Quizes/EditQuestions';
import QuizSolve from './routes/Quizes/Solve';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index/>
    },
    {
        path: "/auth",
        children: 
        [
            {
                path: "signUp",
                element: <AuthSignUp/>
            },
            {
                path: "signIn",
                element: <AuthSignIn/>
            }
        ]  
    },
    {
        path: "/profile",
        children: 
        [
            {
                path: "",
                element: <ProfileIndex/>
            },
            {
                path: "changeAvatar",
                element: <ProfileChangeAvatar/>
            },
            {
                path: "changePassword",
                element: <ProfileChangePassword/>
            },
            {
                path: "changeUsername",
                element: <ProfileChangeUsername/>
            }
        ]
    },
    {
        path: "/quizes",
        children: 
        [
            {
                path: "",
                element: <QuizIndex/>
            },
            {
                path: "create",
                element: <QuizCreate/>
            },
            {
                path: ":id",
                element: <QuizDetails/>
            },
            {
                path: ":id/edit",
                element: <QuizEdit/>
            },
            {
                path: ":id/editQuestions",
                element: <QuizEditQuestions/>
            },
            {
                path: ":id/solve",
                element: <QuizSolve/>
            }
        ]
    },
    {
        path: "/users",
        children: 
        [
            {
                path: "",
                element: <UserIndex/>
            },
            {
                path: ":id",
                element: <UserDetails/>
            }
        ]
    },
    {
        path: "/categories",
        element: <CategoriesIndex/>
    },
    {
        path: "/friendshipRequests",
        element: <FriendshipRequests/>
    }
]);

const App = () => (
    <RouterProvider router={router}/>
);

export default App;
