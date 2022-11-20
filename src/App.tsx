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
                path: "{id}",
                element: <QuizDetails/>
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
                path: "{id}",
                element: <UserDetails/>
            }
        ]
    }
]);

const App = () => (
    <RouterProvider router={router}/>
);

export default App;
