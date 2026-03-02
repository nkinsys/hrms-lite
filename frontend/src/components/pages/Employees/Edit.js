import { Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from "@mui/material";
import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import validationSchema from "../../../scripts/validation-schema";
import Api from "../../../services/Api";
import { EMPLOYEE_GET, EMPLOYEE_ADD, EMPLOYEE_UPDATE, EMPLOYEE_DELETE, DEPARTMENTS } from "../../../constants/URL";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { alert, confirm } from "../../fragments/Dialog";
import { KeyboardBackspace } from "@mui/icons-material";
import { useStorage } from "../../../services/Storage";

/**
 * @returns {Object}
 * @throws {Error}
 */
function getDepartments() {
    let departments = [{ value: '', label: 'Select Department' }];

    try {
        const response = Api.get(DEPARTMENTS, {}, {}, false);
        let data = response.responseJSON;
        Object.values(data.results).forEach((value) => {
            departments.push({ value: value.id, label: value.name });
        });
    } catch (response) {
        if (response.responseJSON && response.responseJSON.detail) {
            throw new Error(response.responseJSON.detail);
        } else {
            throw new Error("Something went wrong! Kindly try after sometime. 1");
        }
    }

    return departments;
}

/**
 * @param {Object} data
 * @returns {Object}
 */
function convertToFormData(data) {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        department: data.department.id
    };
}

/**
 * @param {Object} values
 * @returns {Object}
 */
function convertToPayload(values) {
    return {
        name: values.name,
        email: values.email,
        department: values.department
    };
}

/**
 * @param {Number} pk
 * @returns {Object}
 * @throws {Error}
 */
function getEmployee(pk) {
    return Api.get(EMPLOYEE_GET.replace(":pk", pk), {}, {})
        .then((response) => {
            return convertToFormData(response.responseJSON);
        }).catch((response) => {
            if (response.responseJSON && response.responseJSON.detail) {
                throw new Error(response.responseJSON.detail);
            } else {
                throw new Error("Something went wrong! Kindly try after sometime. 2");
            }
        });
}

/**
 * @param {Number} pk
 * @param {Object} values
 * @returns {Object}
 * @throws {Error|Object}
 */
async function submit(pk, values) {
    const data = convertToPayload(values);
    const formData = new FormData();
    formData.append('file', values.photo);

    let request;
    if (pk) {
        request = Api.put(EMPLOYEE_UPDATE.replace(':pk', pk), data)
    } else {
        request = Api.post(EMPLOYEE_ADD, data)
    }
    return request.then((response) => {
        return convertToFormData(response.responseJSON);
    }).catch((response) => {
        if (response.responseJSON) {
            if (response.responseJSON.detail) {
                throw new Error(response.responseJSON.detail);
            } else {
                let errors = { ...response.responseJSON }
                if (errors.hasOwnProperty('department')) {
                    Object.keys(errors['department']).forEach((field) => {
                        if (errors.hasOwnProperty(field)) {
                            errors[field] = errors[field].concat(errors['department'][field]);
                        } else {
                            errors[field] = errors['department'][field];
                        }
                    });
                    delete errors['department'];
                }
                Object.keys(errors).forEach((field) => {
                    errors[field] = errors[field].join("<br>");
                });
                throw errors;
            }
        } else {
            throw new Error('Something went wrong! Kindly try after sometime. 3');
        }
    });
};

async function remove(pk) {
    return Api.delete(EMPLOYEE_DELETE.replace(':pk', pk))
        .then((response) => {
            return response.responseJSON;
        }).catch((response) => {
            if (response.responseJSON && response.responseJSON.detail) {
                throw new Error(response.responseJSON.detail);
            } else {
                throw new Error("Something went wrong! Kindly try after sometime. 4");
            }
        });
}

function Edit() {
    const { pk } = useParams();
    const storage = useStorage('session');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(true);
    const employee = useRef(null);
    const title = useRef("Employees");
    const pageTitle = useRef("");
    const departments = useRef([]);
    const employeeSchema = useRef(null);

    if (!employeeSchema.current) {
        employeeSchema.current = validationSchema.createSchema({
            rules: {
                name: {
                    required: true,
                    minlength: 3,
                    maxlength: 254
                },
                email: "required email",
                department: "required"
            }
        });
    }

    if (!pk) {
        employee.current = {
            name: '', email: '', department: ''
        };
        title.current = 'New Employee | Employees';
        pageTitle.current = 'New Employee';
    }

    useEffect(function () {
        // departments.current = storage.get('departments');
        if (!departments.current) {
            departments.current = [];
        }

        if (departments.current.length === 0) {
            try {
                departments.current = getDepartments();
                storage.set('departments', departments.current);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }

        if (pk) {
            if (!loading && !error && !employee.current) {
                setLoading(true);
                getEmployee(pk).then((data) => {
                    employee.current = data;
                    title.current = data.name + ' | Employees';
                    pageTitle.current = data.name;
                }).catch((err) => {
                    setError(err.message);
                }).finally(() => setLoading(false));
            }
        }
    }, [storage, pk, loading, error]);

    async function handleSubmit(values, actions) {
        setError('');

        submit(pk, values).then((data) => {
            alert({
                title: "Success",
                content: "Employee " + data.name + " has been successfully " + (pk ? "updated" : "added") + ".",
                callback: () => navigate("/employees")
            });
        }).catch((err) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                actions.setErrors(err);
            }
        }).finally(() => actions.setSubmitting(false));
    };

    function handleDelete(data, setSubmitting) {
        setSubmitting(true);
        confirm({
            content: "Are you sure you want to delete employee " + data.name + "?",
            callback: (result) => {
                if (result) {
                    remove(pk).then(() => {
                        alert({
                            title: "Success",
                            content: "Employee " + data.name + " has been successfully deleted.",
                            callback: () => navigate("/employees")
                        });
                    }).catch((err) => {
                        setError(err.message);
                    }).finally(() => setSubmitting(false));
                } else {
                    setSubmitting(false);
                }
            }
        });
    }

    return (
        <TwoColumnsLeft meta={{ title: title.current }} pageTitle={pageTitle.current}>
            {loading && <Box className="column-main-center">
                <CircularProgress sx={{ color: theme.palette.mode === MODE_DARK ? "secondary.main" : colors.grey[100] }} />
            </Box>}
            {!loading && error && <Box
                className={!employee.current ? "column-main-center" : ''}
                sx={{ textAlign: "center", color: "error.main", mb: 1.5 }}
            >
                <Grid container>
                    <Grid size={12}>
                        <span>{error}</span>
                    </Grid>
                    {!employee.current && <Grid size={12}>
                        <Button
                            onClick={() => navigate("/employees")}
                            color={theme.palette.mode === MODE_DARK ? 'secondary' : 'primary'}
                        >Back</Button>
                    </Grid>}
                </Grid>
            </Box>}
            {!loading && employee.current &&
                <Grid container justifyContent="center">
                    <Grid size={{ xs: 12, md: 10 }}>
                        <Formik
                            initialValues={employee.current}
                            validationSchema={employeeSchema.current}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, isSubmitting, handleBlur, handleChange, setFieldValue, setFieldTouched, setSubmitting }) => (
                                <Form id="employeeForm" noValidate autoComplete="off">
                                    <Grid container rowSpacing={3} columnSpacing={{ md: 3 }}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                variant="outlined"
                                                color="info"
                                                type="text"
                                                id="name"
                                                label="Fullname"
                                                name="name"
                                                slotProps={{
                                                    input: {
                                                        minLength: 3,
                                                        maxLength: 254
                                                    }
                                                }}
                                                value={values.name}
                                                error={!!touched.name && !!errors.name}
                                                helperText={touched.name && errors.name}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                variant="outlined"
                                                color="info"
                                                type="email"
                                                id="email"
                                                label="Email"
                                                name="email"
                                                slotProps={{
                                                    input: {
                                                        minLength: 10,
                                                        maxLength: 254
                                                    }
                                                }}
                                                value={values.email}
                                                error={!!touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                variant="outlined"
                                                color="info"
                                                select
                                                id="department"
                                                label="Department"
                                                name="department"
                                                value={values.department}
                                                error={!!touched.department && !!errors.department}
                                                helperText={touched.department && errors.department}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                                sx={{ display: departments.current.length > 1 ? '' : 'none' }}
                                            >
                                                {departments.current.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" mt={3}>
                                        <Grid size={{ xs: 12, md: pk ? 9 : 6, xl: pk ? 6 : 4 }} sx={{ display: { sm: "flex" } }}>
                                            <Button
                                                type="button"
                                                color="inherit"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ mb: 3 }}
                                                onClick={() => {
                                                    navigate("/employees");
                                                }}
                                            >
                                                <Typography variant="button"
                                                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                                    <KeyboardBackspace /><span>&nbsp;Back</span>
                                                </Typography>
                                            </Button>
                                            {pk && <Button
                                                type="button"
                                                color="error"
                                                variant="outlined"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ mb: 3, ml: { sm: "2rem" } }}
                                                onClick={() => {
                                                    handleDelete(values, setSubmitting);
                                                }}
                                            >
                                                <Typography variant="button" fontWeight="bold">Delete</Typography>
                                            </Button>}
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
                </Grid>}
        </TwoColumnsLeft>
    );
}

export default Edit;