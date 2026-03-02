import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Box, Button, CircularProgress, Grid, useTheme } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import DataGrid, { ActionCellItem } from "../../elements/DataGrid";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { ATTENDANCE, EMPLOYEE_GET } from "../../../constants/URL";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Api from "../../../services/Api";

/**
 * @param {Number} pk
 * @returns {Object}
 * @throws {Error}
 */
function getEmployee(pk, period) {
    return Api.get(EMPLOYEE_GET.replace(":pk", pk), {}, {})
        .then((response) => {
            return response.responseJSON;
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

function Index() {
    const { pk } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const employee = useRef(null);
    const title = useRef("Attendance");
    const pageTitle = useRef("");
    const navigate = useNavigate();
    const minDate = dayjs().subtract(7, 'day');

    const columns = [
        {
            field: "name",
            headerName: "Employee Name",
            serverFieldName: "employee__name",
            flex: 1,
            type: "string",
            minWidth: 120,
            valueGetter: (value, row) => row.employee.name
        },
        {
            field: "email",
            headerName: "Email",
            serverFieldName: "employee__email",
            flex: 1,
            type: "string",
            minWidth: 200,
            valueGetter: (value, row) => row.employee.email
        },
        {
            field: "department",
            headerName: "Department",
            serverFieldName: "employee__department__name",
            flex: 1,
            type: "string",
            minWidth: 150,
            valueGetter: (value, row) => row.employee.department.name
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            type: "date",
            minWidth: 100
        },
        {
            field: "status",
            align: "left",
            headerName: "Status",
            resizable: false,
            type: "string",
            minWidth: 110,
            valueGetter: (value) => {
                switch (value) {
                    case 1:
                        return "Present";

                    default:
                        return "Absent";
                }
            }
        },
        {
            field: "created_at",
            headerName: "Created At",
            resizable: false,
            type: "dateTime",
            minWidth: 155
        },
        {
            field: 'actions',
            align: "center",
            headerName: "Actions",
            headerAlign: "center",
            filterable: false,
            sortable: false,
            resizable: false,
            type: 'actions',
            minWidth: 115,
            getActions: (params) => {
                const actions = [];
                if (dayjs(params.row.date).isAfter(minDate)) {
                    actions.push(
                        <ActionCellItem
                            link={"/attendance/" + params.id + "/edit"}
                            label="Edit"
                            icon={<EditRounded />}
                            title="Edit"
                            sx={{
                                color: theme.palette.mode === MODE_DARK ? theme.palette.secondary.main : colors.grey[500]
                            }}
                        />
                    );
                }
                return actions;
            },
        },
    ];

    const defaultParams = {
        "filter": {
            "items": [
                {
                    "field": "employee__id",
                    "operator": "exact",
                    "value": pk
                }
            ]
        }
    };

    useEffect(() => {
        setLoading(true);

        getEmployee(pk).then((data) => {
            employee.current = data;
            title.current = data.name + ' | Attendance';
            pageTitle.current = data.name + " Attendance";
        }).catch((err) => {
            setError(err.message);
        }).finally(() => setLoading(false));
    }, [pk]);

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
                <>
                    {employee.current.attendance_status === null && <Box textAlign="right">
                        <Button variant="contained"
                            size="large"
                            onClick={() => navigate("/employees/" + employee.current.id + "/attendance/register/current")}
                            color="secondary"
                            sx={[
                                { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[400] },
                                { '&:hover': { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[900] } },
                            ]}
                        >Mark Today's Attendance</Button>
                    </Box>}
                    <DataGrid columns={columns} url={ATTENDANCE} defaultParams={defaultParams}></DataGrid>
                </>
            }
        </TwoColumnsLeft>
    );
}

export default Index;