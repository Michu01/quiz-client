import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Index from './routes/Index';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index/>
    }
]);

const App = () => (
    <RouterProvider router={router}/>
);

export default App;
