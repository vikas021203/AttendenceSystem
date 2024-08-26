import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttendancePage from './AttendencePage';
import HomePage from './HomePage';
import RegisterPage from './Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
            </Routes>
        </Router>
    );
};

export default App;
