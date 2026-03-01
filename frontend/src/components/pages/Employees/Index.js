import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { Box, Button, useTheme } from "@mui/material";
import { EditRounded, SendRounded, VisibilityRounded } from "@mui/icons-material";
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
            filterFieldName: "department__name",
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
            minWidth: 155,
            valueGetter: (value) => value && new Date(value)
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            resizable: false,
            type: "dateTime",
            minWidth: 155,
            valueGetter: (value) => value && new Date(value)
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
            getActions: (params) => [
                <ActionCellItem
                    link={"/employees/" + params.id + "/view"}
                    label="View"
                    icon={<VisibilityRounded />}
                    title="View"
                    sx={{
                        color: theme.palette.mode === MODE_DARK ? theme.palette.info.main : colors.grey[500]
                    }}
                />,
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
                    label="Issue"
                    icon={<SendRounded />}
                    title="Issue"
                    sx={{
                        color: theme.palette.mode === MODE_DARK ? theme.palette.error.main : colors.grey[500]
                    }}
                />
            ],
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