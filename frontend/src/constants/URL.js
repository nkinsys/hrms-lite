export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + 'rest/V1/';

/** EMPLOYEE APIs */
export const EMPLOYEES = API_BASE_URL + 'employees';
export const EMPLOYEE_ADD = API_BASE_URL + 'employees';
export const EMPLOYEE_GET = API_BASE_URL + 'employees/:pk';
export const EMPLOYEE_UPDATE = API_BASE_URL + 'employees/:pk';
export const EMPLOYEE_DELETE = API_BASE_URL + 'employees/:pk';
export const EMPLOYEE_ISSUE = API_BASE_URL + 'employees/:pk/issue';

/** ATTENDANCE APIs */
export const ATTENDANCE = API_BASE_URL + 'attendance';
export const EMPLOYEE_ATTENDANCE = API_BASE_URL + 'employees/:pk/attendance';
export const ATTENDANCE_ADD = API_BASE_URL + 'attendance';

/** REPORTS APIs */
export const ATTENDANCE_MTD_REPORT = API_BASE_URL + 'attendance/mtd';
export const ATTENDANCE_MTD_REPORT_BY_DEPARTMENT = API_BASE_URL + 'attendance/mtd-by-department';
