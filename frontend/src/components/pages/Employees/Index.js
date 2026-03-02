import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Box, Button, useTheme } from "@mui/material";
import { EditRounded, HowToReg, SendRounded } from "@mui/icons-material";
import DataGrid, { ActionCellItem } from "../../elements/DataGrid";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { EMPLOYEES } from "../../../constants/URL";
import { useNavigate } from "react-router-dom";

function Index() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const columns = [
        {
            field: "id",
            align: "right",
            headerName: "Employee ID",
            headerAlign: "center",
            resizable: false,
            type: "number",
            minWidth: 80
        },
        {
            field: "name",
            headerName: "Fullname",
            flex: 1,
            type: "string",
            minWidth: 120
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            type: "string",
            minWidth: 200
        },
        {
            field: "department",
            headerName: "Department",
            serverFieldName: "department__name",
            flex: 1,
            type: "string",
            minWidth: 200,
            valueGetter: (value) => value && value.name
        },
        {
            field: "created_at",
            headerName: "Created At",
            resizable: false,
            type: "dateTime",
            minWidth: 155
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            resizable: false,
            type: "dateTime",
            minWidth: 155
        },
        {
            field: "attendance_status",
            headerName: "Status",
            resizable: false,
            type: "string",
            minWidth: 110,
            valueGetter: (value) => {
                switch (value) {
                    case 0:
                        return "Absent";

                    case 1:
                        return "Present";

                    default:
                        return "Pending";
                }
            }
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
                let actions = [
                    <ActionCellItem
                        link={"/employees/" + params.id + "/edit"}
                        label="Edit"
                        icon={<EditRounded />}
                        title="Edit"
                        sx={{
                            color: theme.palette.mode === MODE_DARK ? theme.palette.secondary.main : colors.grey[500]
                        }}
                    />,
                    <ActionCellItem
                        link={"/employees/" + params.id + "/attendance"}
                        label="Attendance"
                        icon={<SendRounded />}
                        title="Attendance"
                        sx={{
                            color: theme.palette.mode === MODE_DARK ? theme.palette.error.main : colors.grey[500]
                        }}
                    />
                ];

                if (params.row.attendance_status === null) {
                    actions.push(
                        <ActionCellItem
                            link={"/employees/" + params.id + "/attendance/register/current"}
                            label="Mark Today's Attendance"
                            icon={<HowToReg />}
                            title="Mark Today's Attendance"
                            sx={{
                                color: theme.palette.mode === MODE_DARK ? theme.palette.error.main : colors.grey[500]
                            }}
                        />
                    );
                }

                return actions;
            },
        },
    ];

    return (
        <TwoColumnsLeft meta={{ title: "Manage Employees" }} pageTitle="Manage Employees">
            <Box textAlign="right">
                <Button variant="contained"
                    size="large"
                    onClick={() => navigate("/employees/register")}
                    color="secondary"
                    sx={[
                        { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[400] },
                        { '&:hover': { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[900] } },
                    ]}
                >Add New Employee</Button>
            </Box>
            <DataGrid columns={columns} url={EMPLOYEES}></DataGrid>
        </TwoColumnsLeft>
    );
}

export default Index;