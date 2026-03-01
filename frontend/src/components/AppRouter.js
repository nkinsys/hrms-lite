import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees/Index";
import AddorEditEmployee from "./pages/Employees/Edit"; 
import Attendance from "./pages/Attendance/Index";
import EmployeeAttendance from "./pages/Employees/Attendance";
import MarkAttendance from "./pages/Attendance/New";
import RegisterEmployeeAttendance from "./pages/Attendance/Register"; 
import NoPage from "./pages/NoPage";

export default class AppRouter extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="employees">
                        <Route index element={<Employees />} />
                        <Route path="register" element={<AddorEditEmployee />} />
                        <Route path=":pk/edit" element={<AddorEditEmployee />} />
                        <Route path=":pk/attendance" element={<EmployeeAttendance />} />
                        <Route path=":pk/attendance/register" element={<RegisterEmployeeAttendance />} />
                    </Route>
                    <Route path="attendance">
                        <Route index element={<Attendance />} />
                        <Route path="register" element={<MarkAttendance />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        );
    };
}