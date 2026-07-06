import { BrowserRouter, Routes, Route } from 'react-router';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import ChatAppPage from './pages/ChatAppPage';
import { GlobalToaster } from './utils/toast';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <>
            <GlobalToaster />
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path='/signin' element={<SigninPage />} />
                    <Route path='/signup' element={<SignupPage />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path='/' element={<ChatAppPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
