import TwoColumnsLeft from "../layouts/TwoColumnsLeft";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NoPage() {
    const navigate = useNavigate();

    return (
        <TwoColumnsLeft meta={{ title: "404 Not Found" }} pageTitle="404 Not Found">
            <Box>404 Not Found</Box>
            <Box>
                <Button color="secondary" onClick={() => { navigate("/") }}>Back To Home</Button>
            </Box>
        </TwoColumnsLeft>
    );
}

export default NoPage;