import { LightModeOutlined, DarkModeOutlined, AccountCircleOutlined, NotificationsOutlined, MenuRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, IconButton, Popover, Typography, useTheme } from "@mui/material";
import { ColorModeContext, MODE_DARK, tokens } from "../../scripts/theme";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import PageTitle from "../fragments/PageTitle";
import Badge from "../elements/Styled/Badge";
import { MobileView, useView } from "../utils/View";
import { Link } from "react-router-dom";

function showSidebar() {
    let elements = document.getElementsByClassName('sidebar-main');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.left = '0';
    }
}

function notificationsLabel(count) {
    if (count === 0) {
        return 'no notifications';
    }
    if (count > 99) {
        return 'more than 99 notifications';
    }
    return `${count} notifications`;
}

function Header({ pageTitle }) {
    const user = useContext(UserContext);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const currentView = useView();
    const [view, setView] = useState(currentView);
    if (view !== currentView) {
        if (open) {
            handleClose();
        } else {
            setView(currentView);
        }
    }

    const logout = () => {
        window.location.href = "/";
    };

    return (
        <header id="header" className="page-header">
            <Box p={1} mb={3} className="panel wrapper">
                <MobileView>
                    <Box>
                        <IconButton onClick={showSidebar}><MenuRounded /></IconButton>
                    </Box>
                </MobileView>
                <PageTitle title={pageTitle}></PageTitle>
                <Box sx={{ textAlign: "right", flex: "1 0 auto" }}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? <DarkModeOutlined /> : <LightModeOutlined />}
                    </IconButton>
                    <IconButton aria-label={notificationsLabel(0)}>
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsOutlined />
                        </Badge>
                    </IconButton>
                    <IconButton
                        onClick={handleClick}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    ><AccountCircleOutlined /></IconButton>
                </Box>
                <Popover
                    id={open ? 'account-menu' : undefined}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{
                        backgroundColor: colors.primary[400],
                        pt: 1, pr: 1, pb: 2, pl: 2
                    }}>
                        <Grid container>
                            <Grid size={12} sx={{ textAlign: "right" }}>
                                <Button id="logout" onClick={() => logout()}
                                    sx={[
                                        { color: "inherit", textTransform: "capitalize", fontSize: "1rem" },
                                        { "&:hover": { backgroundColor: theme.palette.mode === MODE_DARK ? colors.blueAccent[500] : '' } }
                                    ]}
                                >Logout</Button>
                            </Grid>
                            <Grid sx={{ mr: 2 }}>
                                <Avatar
                                    alt={user.full_name}
                                    sx={{ width: "88px", height: "88px" }}
                                />
                            </Grid>
                            <Grid sx={{ mt: 1, maxWidth: "calc(100% - 104px)", flex: "1 1 auto" }}>
                                <Typography title={user.full_name}
                                    sx={{ fontSize: "18px", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {user.full_name}
                                </Typography>
                                <Typography title={user.email}
                                    sx={{ maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {user.email}
                                </Typography>
                                <Link to="#" style={{ color: colors.blueAccent[500] }}>My Profile</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Popover>
            </Box>
        </header>
    );
}

export default Header;