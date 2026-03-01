import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Box, Button, useTheme } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import DataGrid, { ActionCellItem } from "../../elements/DataGrid";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { ATTENDANCE } from "../../../constants/URL";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
                if (dayjs(params.date).isAfter(dayjs().subtract(7, 'day'))) {
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