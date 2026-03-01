import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Box, Button, useTheme } from "@mui/material";
import DataGrid from "../../elements/DataGrid";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { ATTENDANCE } from "../../../constants/URL";
import { useNavigate } from "react-router-dom";

function Index() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const columns = [
        {
            field: "name",
            headerName: "Employee Name",
            filterFieldName: "employee__name",
            flex: 1,
            type: "string",
            minWidth: 120,
            valueGetter: (value, row) => row.employee.name
        },
        {
            field: "email",
            headerName: "Email",
            filterFieldName: "employee__email",
            flex: 1,
            type: "string",
            minWidth: 200,
            valueGetter: (value, row) => row.employee.email
        },
        {
            field: "department",
            headerName: "Department",
            filterFieldName: "employee__department__name",
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
    ];

    return (
        <TwoColumnsLeft meta={{ title: "Attendance" }} pageTitle="Manage Attendance">
            <Box textAlign="right">
                <Button variant="contained"
                    size="large"
                    onClick={() => navigate("/attendance/register")}
                    color="secondary"
                    sx={[
                        { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[400] },
                        { '&:hover': { backgroundColor: theme.palette.mode === MODE_DARK ? '' : colors.primary[900] } },
                    ]}
                >Mark Today's Attendance</Button>
            </Box>
            <DataGrid columns={columns} url={ATTENDANCE}></DataGrid>
        </TwoColumnsLeft>
    );
}

export default Index;