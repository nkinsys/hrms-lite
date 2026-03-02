import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../scripts/theme";

function PageTitle({ title, ...attrs}) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box color={colors.grey[100]} className="page-title-wrapper" {...attrs}>
            <Typography variant="h1" className="page-title">
                <span data-ui-id="page-title-wrapper">{title}</span>
            </Typography>
        </Box>
    );
}

export default PageTitle;