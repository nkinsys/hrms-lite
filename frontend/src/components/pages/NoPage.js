import TwoColumnsLeft from "../layouts/TwoColumnsLeft";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NoPage() {
    const navigate = useNavigate();

    return (
        <TwoColumnsLeft meta={{ title: "404 Not Found" }} pageTitle="404 Not Found">
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h1">404 Page Not Found</Typography>
                </Box>
                <Box>
                    <Button color="secondary" onClick={() => { navigate("/") }}>Back To Home</Button>
                </Box>
            </Box>
        </TwoColumnsLeft>
    );
}

export default NoPage;