import { Grid, Typography } from "@mui/material";
import TwoColumnsLeft from "../layouts/TwoColumnsLeft";
import DataGrid from "../elements/DataGrid";
import { ATTENDANCE_MTD_REPORT, ATTENDANCE_MTD_REPORT_BY_DEPARTMENT } from "../../constants/URL";

function Dashboard() {
    const mtd_columns = [
        {
            field: "date",
            align: "center",
            flex: 1,
            headerName: "Date",
            headerAlign: "center",
            type: "date"
        },
        {
            field: "present",
            align: "center",
            flex: 1,
            headerName: "Present",
            headerAlign: "center",
            type: "number"
        },
        {
            field: "absent",
            align: "center",
            flex: 1,
            headerName: "Absent",
            headerAlign: "center",
            type: "number"
        },
    ];

    const mtd_by_department_columns = [
        {
            field: "date",
            align: "center",
            flex: 1,
            headerName: "Date",
            headerAlign: "center",
            type: "date"
        },
        {
            field: "department_name",
            align: "center",
            flex: 1,
            headerName: "Department",
            headerAlign: "center",
            type: "string"
        },
        {
            field: "present",
            align: "center",
            flex: 1,
            headerName: "Present",
            headerAlign: "center",
            type: "number"
        },
        {
            field: "absent",
            align: "center",
            flex: 1,
            headerName: "Absent",
            headerAlign: "center",
            type: "number"
        },
    ];

    return (
        <TwoColumnsLeft meta={{ title: "Dashboard" }} pageTitle="Dashboard">
            <Grid container>
                <Grid size={12}>
                    <Grid size={{ md: 12, xl: 6 }} sx={{ mb: 6 }}>
                        <Typography variant="h3">Attendance MTD Report</Typography>
                        <DataGrid columns={mtd_columns} url={ATTENDANCE_MTD_REPORT} identifier={'date'}></DataGrid>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <Grid size={{ md: 12, xl: 8 }} sx={{ mb: 6 }}>
                        <Typography variant="h3">Attendance MTD Report By Department</Typography>
                        <DataGrid columns={mtd_by_department_columns} url={ATTENDANCE_MTD_REPORT_BY_DEPARTMENT} identifier={['date', 'department_id']}></DataGrid>
                    </Grid>
                </Grid>
            </Grid>
        </TwoColumnsLeft>
    );
}

export default Dashboard;