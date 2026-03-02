import { useTheme, Box } from "@mui/material";
import { tokens } from "../../scripts/theme";
import appPackageJson from "../../../package.json";

function Footer() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <footer id="footer"
            className="page-footer"
            style={{ backgroundColor: colors.primary[400] }}>
            <Box className="copyright">
                <span className="me-2">Copyright &copy; {(new Date()).getFullYear()}</span>
                <span>Version - {appPackageJson.version}</span>
            </Box>
        </footer>
    );
}

export default Footer;