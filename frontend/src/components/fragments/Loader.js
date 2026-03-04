import { useTheme } from "@emotion/react";
import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { MODE_DARK, tokens } from "../../scripts/theme";
import { useCustomEventListener } from "../../services/Event";

function Loader(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [display, setDisplay] = useState(false);

    useCustomEventListener('loader.' + props.name, (show) => {
        setDisplay(show === true || show === 1 || show === '1');
    });

    return (
        <Box className="loading-mask" sx={display ? {} : { display: 'none' }}>
            <Box className="loader">
                <CircularProgress sx={{ color: theme.palette.mode === MODE_DARK ? "secondary.main" : colors.grey[100] }} />
            </Box>
        </Box>
    );
}

export default Loader;