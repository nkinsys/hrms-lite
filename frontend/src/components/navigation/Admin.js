import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { tokens } from "../../scripts/theme";
import { CloseRounded, GroupsRounded, HomeOutlined, ManageAccountsRounded, MenuRounded, PersonAddAltRounded, HowToReg, BallotRounded } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useStorage } from "../../services/Storage";
import { isMobile, isTablet } from "../utils/View";
import { get_absolute_url } from "../utils/Files";

const Item = ({ label, link, icon }) => {
    return (
        <MenuItem
            component={<NavLink to={link} relative="path" />}
            active={window.location.pathname === link}
            icon={icon}
        >
            {label}
        </MenuItem>
    );
};

const SubMenuItem = ({ label, link, icon, children }) => {
    let isActive = window.location.pathname.startsWith(link);

    return (
        <SubMenu label={label} icon={icon} active={isActive} defaultOpen={isActive}>
            {children}
        </SubMenu>
    );
};

function hideSidebar() {
    let elements = document.getElementsByClassName('sidebar-main');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.left = '';
    }
}

function Nav({ user }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const storage = useStorage('local');

    const [isCollapsed, setIsCollapsed] = useState(false);

    const collapse = (collapse) => {
        if (collapse !== isCollapsed) {
            storage.set('sidebar_collapsed', collapse);
            setIsCollapsed(collapse);
        }
    };

    let collapsed = false;
    if (isMobile()) {
        hideSidebar();
        storage.set('sidebar_tablet_view_init', false);
    } else if (isTablet()) {
        if (storage.get('sidebar_tablet_view_init')) {
            collapsed = storage.get('sidebar_collapsed');
        } else {
            collapsed = true;
            storage.set('sidebar_tablet_view_init', true);
        }
    } else {
        collapsed = storage.get('sidebar_collapsed');
        storage.set('sidebar_tablet_view_init', false);
    }

    collapse(collapsed);

    return (
        <>
            <Sidebar
                style={{
                    backgroundColor: `${colors.primary[400]}`
                }}
                collapsed={isCollapsed}
            >
                {!isCollapsed && (
                    <Box mt={2} mb={3} sx={{ position: "relative" }}>
                        <Box sx={{ position: "absolute", right: "2px", top: "-14px" }}>
                            <IconButton
                                title="close"
                                onClick={() => isMobile() ? hideSidebar() : collapse(true)}
                            >
                                <CloseRounded />
                            </IconButton>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Avatar
                                alt={user.full_name}
                                src={user.photo ? get_absolute_url(user.photo) : ''}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Box>
                        <Box textAlign="center">
                            <Typography
                                variant="h2"
                                color={colors.grey[100]}
                                fontWeight="bold"
                                sx={{ m: "10px 0 0 0" }}
                            >
                                {user.full_name}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Menu
                    menuItemStyles={{
                        subMenuContent: (props) => {
                            // only apply styles when collapsed
                            if (isCollapsed)
                                return {
                                    backgroundColor: `${colors.primary[400]} !important`,
                                };
                        }
                    }}
                >
                    {isCollapsed && (
                        <MenuItem
                            icon={
                                <IconButton title="open">
                                    <MenuRounded />
                                </IconButton>
                            }
                            onClick={() => collapse(false)}
                        />
                    )}
                    <Item
                        label="Dashboard"
                        link="/"
                        icon={<HomeOutlined />}
                    />
                    <SubMenuItem label="Employee" link="/employees" icon={<GroupsRounded />}>
                        <Item
                            label="Manage"
                            link="/employees"
                            icon={<ManageAccountsRounded />}
                        />
                        <Item
                            label="Register"
                            link="/employees/register"
                            icon={<PersonAddAltRounded />}
                        />
                    </SubMenuItem>
                    <SubMenuItem label="Attendance" link="/attendance" icon={<HowToReg />}>
                        <Item
                            label="Today's Attendance"
                            link="/attendance/today"
                            icon={<HowToReg />}
                        />
                        <Item
                            label="ALL Attendance"
                            link="/attendance"
                            icon={<BallotRounded />}
                        />
                    </SubMenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}

export default Nav;