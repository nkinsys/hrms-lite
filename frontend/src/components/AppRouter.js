import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees/Index";
import AddorEditEmployee from "./pages/Employees/Edit"; 
import Attendance from "./pages/Attendance/Index";
import TodayAttendance from "./pages/Attendance/Today";
import NoPage from "./pages/NoPage";

export default class AppRouter extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="employees">
                        <Route index element={<Employees />} />
                        <Route path="register" element={<AddorEditEmployee />} />
                        <Route path=":pk/edit" element={<AddorEditEmployee />} />
                    </Route>
                    <Route path="attendance">
                        <Route index element={<Attendance />} />
                        <Route path="today" element={<TodayAttendance />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        );
    };
}