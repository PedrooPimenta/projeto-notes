import {Routes, Route} from 'react-router-dom';

import {SignUp} from '../pages/SignUp';
import {SignIn} from '../pages/Signln';


export function AuthRoutes() {

    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            
        </Routes>
    );
}