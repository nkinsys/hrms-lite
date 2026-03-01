import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Form, Formik } from "formik";
import { Box, Button, CircularProgress, Grid, Typography, useTheme, MenuItem, TextField } from "@mui/material";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { EMPLOYEE_GET, ATTENDANCE_ADD } from "../../../constants/URL";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/Api";
import { useState } from "react";
import { useRef } from "react";
import { KeyboardBackspace } from "@mui/icons-material";
import { alert } from "../../fragments/Dialog";
import dayjs from "dayjs";
import validationSchema from "../../../scripts/validation-schema";

/**
 * @param {Number} pk
 * @returns {Object}
 * @throws {Error}
 */
function getEmployee(pk) {
    return Api.get(EMPLOYEE_GET.replace(":pk", pk), {}, {})
        .then((response) => {
            const employee = response.responseJSON;
            if (employee.attendance_status !== null) {
                const status = employee.attendance_status === 1 ? 'Present' : 'Absent';
                throw new Error(`Employee today's attendance is already marked ${status}. Please verify and try again.`);
            }
            return employee;
        }).catch((response) => {
            if (response instanceof Error) {
                throw response;
            } else if (response.responseJSON && response.responseJSON.detail) {
                throw new Error(response.responseJSON.detail);
            } else {
                throw new Error("Something went wrong! Kindly try after sometime.");
            }
        });
}

function Register() {
    const { pk } = useParams()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const employee = useRef(null);
    const pageTitle = useRef("");
    const attendanceSchema = useRef(null);

    if (!attendanceSchema.current) {
        attendanceSchema.current = validationSchema.createSchema({
            rules: {
                membership_status: "required"
            }
        });
    }

    if (!loading && !error && !employee.current) {
        setLoading(true);
        getEmployee(pk).then((data) => {
            employee.current = data;
            pageTitle.current = "Mark Today's Attendance For " + data.name;
        }).catch((err) => {
            setError(err.message);
        }).finally(() => setLoading(false));
    }

    async function handleSubmit(values, actions) {
        setError('');

        const data = {
            employee: pk,
            date: dayjs().format('YYYY-MM-DD'),
            status: values['status']
        };

        return Api.post(ATTENDANCE_ADD, data).then((response) => {
            const status = response.responseJSON.status === 1 ? 'Present' : 'Absent';
            const name = response.responseJSON.employee.name;
            alert({
                title: "Success",
                content: `Employee ${name} attendance for today has been successfully marked ${status}.`,
                callback: () => navigate("/attendance/register")
            });
        }).catch((response) => {
            if (response.responseJSON && response.responseJSON.detail) {
                setError(response.responseJSON.detail);
            } else {
                setError('Something went wrong! Kindly try after sometime.');
            }
        }).finally(() => actions.setSubmitting(false));
    };

    return (
        <TwoColumnsLeft meta={{ title: "Mark Today's Attendance" }} pageTitle={pageTitle.current}>
            {loading && <Box className="column-main-center">
                <CircularProgress sx={{ color: theme.palette.mode === MODE_DARK ? "secondary.main" : colors.grey[100] }} />
            </Box>}
            {!loading && error && <Box
                className={!employee.current ? "column-main-center" : ''}
                sx={{ textAlign: "center", color: "error.main", mb: 1.5 }}
            >
                <span>{error}</span>
            </Box>}
            {!loading && employee.current &&
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={10}>
                        <Formik
                            initialValues={employee.current}
                            validationSchema={attendanceSchema.current}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, isSubmitting, handleBlur, handleChange, setFieldValue, setFieldTouched, setSubmitting }) => (
                                <Form id="attendanceForm" noValidate autoComplete="off">
                                    <Grid container rowSpacing={3} columnSpacing={{ md: 3 }}>
                                        <Grid container justifyContent="center">
                                            <Grid size={12}>
                                                Employee ID: {employee.current.id}
                                            </Grid>
                                            <Grid size={12}>
                                                Name: {employee.current.name}
                                            </Grid>
                                            <Grid size={12}>
                                                Email: {employee.current.email}
                                            </Grid>
                                            <Grid  size={12}>
                                                Department: {employee.current.department.name}
                                            </Grid>
                                            <Grid  size={12}>
                                                Date: {employee.current.department.name}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                color="info"
                                                select
                                                id="status"
                                                label="Status"
                                                name="status"
                                                value={values.status}
                                                error={!!touched.status && !!errors.status}
                                                helperText={touched.status && errors.status}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                            >
                                                <MenuItem value="0">Pending</MenuItem>
                                                <MenuItem value="1">Member</MenuItem>
                                                <MenuItem value="2">Renewal Pending</MenuItem>
                                                <MenuItem value="3">Renewed</MenuItem>
                                                <MenuItem value="4">Blocked</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" mt={3}>
                                        <Grid item xs={12} md={pk ? 9 : 6} xl={pk ? 6 : 4} sx={{ display: { sm: "flex" } }}>
                                            <Button
                                                type="button"
                                                color="inherit"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ mb: 3 }}
                                                onClick={() => {
                                                    navigate("/members");
                                                }}
                                            >
                                                <Typography variant="button"
                                                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                                    <KeyboardBackspace /><span>&nbsp;Back</span>
                                                </Typography>
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="info"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ mb: 3, ml: { sm: "2rem" } }}
                                            >
                                                <Typography variant="button" fontWeight="bold">SUBMIT</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            }
        </TwoColumnsLeft>
    );
}

export default Register;