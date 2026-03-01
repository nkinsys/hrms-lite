import TwoColumnsLeft from "../../layouts/TwoColumnsLeft";
import { useTheme } from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import DataGrid, { ActionCellItem } from "../../elements/DataGrid";
import { MODE_DARK, tokens } from "../../../scripts/theme";
import { EMPLOYEES } from "../../../constants/URL";
import { useParams } from "react-router-dom";

function New() {
    const { period } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
                    link={"/employees/" + params.id + "/attendance/register/" + period}
                    label="Mark Attendance"
                    icon={<SendRounded />}
                    title="Mark Attendance"
                    sx={{
                        color: theme.palette.mode === MODE_DARK ? theme.palette.error.main : colors.grey[500]
                    }}
                />
            ],
        },
    ];

    const defaultParams = {
        "filter": {
            "items": [
                {
                    "field": "attendance_status",
                    "operator": "isnull",
                    "value": 1
                }
            ]
        }
    };

    return (
        <TwoColumnsLeft meta={{ title: period === "current" ? "Mark Today's Attendance" : "Mark Attendance" }} pageTitle="Select Employee">
            <DataGrid key={period} columns={columns} url={EMPLOYEES} defaultParams={period === 'current' ? defaultParams : {}}></DataGrid>
        </TwoColumnsLeft>
    );
}

export default New;