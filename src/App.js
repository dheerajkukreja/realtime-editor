import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <div>
                <ToastContainer></ToastContainer>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}></Route>
                    <Route path='/editor/:roomId' element={<EditorPage/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
