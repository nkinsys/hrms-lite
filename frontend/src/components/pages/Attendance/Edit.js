import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Form, Formik } from "formik";
import { Box, Button, CircularProgress, Grid, Typography, useTheme, MenuItem, TextField } from "@mui/material";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { EMPLOYEE_GET, ATTENDANCE_ADD, ATTENDANCE_GET, ATTENDANCE_UPDATE } from "../../../constants/URL";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Api from "../../../services/Api";
import { useEffect, useState } from "react";
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
function getEmployee(pk, period) {
    return Api.get(EMPLOYEE_GET.replace(":pk", pk), {}, {})
        .then((response) => {
            const employee = response.responseJSON;
            if (period === 'current' && employee.attendance_status !== null) {
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

/**
 * @param {Number} pk
 * @returns {Object}
 * @throws {Error}
 */
function getAttendance(pk) {
    return Api.get(ATTENDANCE_GET.replace(":pk", pk), {}, {})
        .then((response) => {
            const attendance = response.responseJSON;
            const minDate = dayjs().subtract(7, 'day');
            if (dayjs(attendance.date).isBefore(minDate)) {
                throw new Error("The attendance date is beyond the 7-day update window and can no longer be modified.");
            }
            return attendance;
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

function Edit() {
    const { pk, employeeId, period } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const attendance = useRef(null);
    const pageTitle = useRef("");
    const attendanceSchema = useRef(null);

    if (!attendanceSchema.current) {
        const schema = {
            rules: {
                status: "required"
            }
        };
        if (!pk && period !== 'current') {
            schema.rules['date'] = {
                type: "date",
                required: true
            };
        }
        attendanceSchema.current = validationSchema.createSchema(schema);
    }

    useEffect(() => {
        if (!loading && !error && !attendance.current) {
            setLoading(true);

            let request;
            if (pk) {
                request = getAttendance(pk).then((data) => {
                    data.date = dayjs(data.date);
                    attendance.current = data;
                    pageTitle.current = `${attendance.current.employee.name} - ${attendance.current.date.format('D MMM, YYYY')} Attendance`
                });
            } else {
                request = getEmployee(employeeId, period).then((data) => {
                    attendance.current = {
                        date: period === 'current' ? dayjs() : null,
                        employee: data,
                        status: ''
                    };
                });
            }

            request.then(() => {
                if (pk || period === 'current') {
                    pageTitle.current = `${attendance.current.employee.name} - ${attendance.current.date.format('D MMM, YYYY')} Attendance`
                } else {
                    pageTitle.current = `${attendance.current.employee.name} Attendance`
                }
            }).catch((err) => {
                setError(err.message);
            }).finally(() => setLoading(false));
        }
    }, [employeeId, pk, period, loading, error]);

    async function handleSubmit(values, actions) {
        setError('');

        let request;
        if (pk) {
            const data = {
                status: parseInt(values['status'])
            };
            request = Api.patch(ATTENDANCE_UPDATE.replace(':pk', pk), data);
        } else {
            const data = {
                employee: parseInt(employeeId),
                date: attendance.current.date.format('YYYY-MM-DD'),
                status: parseInt(values['status'])
            };
            request = Api.post(ATTENDANCE_ADD, data);
        }

        return request.then((response) => {
            const status = response.responseJSON.status === 1 ? 'Present' : 'Absent';
            const name = response.responseJSON.employee.name;
            const date = dayjs(response.responseJSON.date).format('Do MMM, YYYY');
            alert({
                title: "Success",
                content: `Attendance for ${name} on ${date} has been successfully marked as ${status}.`,
                callback: () => navigate(pk ? "/attendance" : ("/attendance/register/" + period))
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
        <TwoColumnsLeft meta={{ title: "Mark Attendance" }} pageTitle={pageTitle.current}>
            {loading && <Box className="column-main-center">
                <CircularProgress sx={{ color: theme.palette.mode === MODE_DARK ? "secondary.main" : colors.grey[100] }} />
            </Box>}
            {!loading && error && <Box
                className={!attendance.current ? "column-main-center" : ''}
                sx={{ textAlign: "center", color: "error.main", mb: 1.5 }}
            >
                <Grid container>
                    <Grid size={12}>
                        <span>{error}</span>
                    </Grid>
                    {!attendance.current && <Grid size={12}>
                        <Button
                            onClick={() => navigate(pk ? "/attendance" : ("/attendance/register/" + period))}
                            color={theme.palette.mode === MODE_DARK ? 'secondary' : 'primary'}
                        >Back</Button>
                    </Grid>}
                </Grid>
            </Box>}
            {!loading && attendance.current &&
                <Grid container justifyContent="center">
                    <Grid size={{ xs: 12, md: 10 }}>
                        <Formik
                            initialValues={attendance.current}
                            validationSchema={attendanceSchema.current}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, isSubmitting, handleBlur, handleChange, setFieldValue, setFieldTouched }) => (
                                <Form id="attendanceForm" noValidate autoComplete="off">
                                    <Grid container rowSpacing={3} columnSpacing={{ md: 3 }}>
                                        <Grid container justifyContent="flex-start">
                                            <Grid size={12}>
                                                Employee ID: {attendance.current.employee.id}
                                            </Grid>
                                            <Grid size={12}>
                                                Name: {attendance.current.employee.name}
                                            </Grid>
                                            <Grid size={12}>
                                                Email: {attendance.current.employee.email}
                                            </Grid>
                                            <Grid size={12}>
                                                Department: {attendance.current.employee.department.name}
                                            </Grid>
                                            {(pk || period === 'current') && <Grid size={12}>
                                                Date: {attendance.current.date.format("MMMM D, YYYY")}
                                            </Grid>}
                                            {(!pk && period !== 'current') && <Grid size={12}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date"
                                                            inputFormat="DD/MM/YYYY"
                                                            name="date"
                                                            defaultValue={values.date}
                                                            maxDate={dayjs().subtract('1', 'day')}
                                                            onClose={() => {
                                                                setFieldTouched('date', true, false);
                                                            }}
                                                            onChange={(value, context) => {
                                                                setFieldValue('date', value);
                                                                setFieldTouched('date', true, false);
                                                                attendance.current.date = value;
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    id: "date",
                                                                    name: "date",
                                                                    value: values.date,
                                                                    required: true,
                                                                    fullWidth: true,
                                                                    error: !!touched.date && !!errors.date,
                                                                    helperText: touched.date && errors.date,
                                                                    sx: {
                                                                        '.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: theme.palette.info.main
                                                                        },
                                                                        '.MuiInputLabel-root.Mui-focused:not(.Mui-error)': {
                                                                            color: theme.palette.info.main
                                                                        }
                                                                    }
                                                                },
                                                                layout: {
                                                                    sx: {
                                                                        '.MuiButtonBase-root.MuiButton-root': {
                                                                            color: 'inherit'
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>}
                                            <Grid size={{ xs: 12, md: 4 }}>
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
                                                    <MenuItem value=''>Select Status</MenuItem>
                                                    <MenuItem value="0">Absent</MenuItem>
                                                    <MenuItem value="1">Present</MenuItem>
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" mt={3}>
                                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: { sm: "flex" } }}>
                                            <Button
                                                type="button"
                                                color="inherit"
                                                variant="outlined"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ mb: 3 }}
                                                onClick={() => {
                                                    navigate(pk ? "/attendance" : ("/attendance/register/" + period));
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

export default Edit;