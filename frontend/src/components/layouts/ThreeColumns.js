import DocumentMeta from "react-document-meta";
import Footer from "../fragments/Footer";
import Header from "../fragments/Header";
import Empty from "./Layout";
import SidebarMain from "../fragments/SidebarMain";
import SidebarAdditional from "../fragments/SidebarAdditional";
import Column from "../elements/Column";
import Message from "../fragments/Message";
import { Box, Grid } from "@mui/material";
import Dialog from "../fragments/Dialog";

export default class ThreeColumns extends Empty {
    constructor (props) {
        super(props);

        this.class = "page-layout-3columns";
    }

    static getColumns(children) {
        let columns = {
            'main': [],
            'sidebarMain': [],
            'sidebarAdditional': []
        };

        if (Array.isArray(children)) {
            children.forEach(element => {
                if (element) {
                    if (element.type === SidebarMain) {
                        columns['sidebarMain'].push(element);
                    } else if (element.type === SidebarAdditional) {
                        columns['sidebarAdditional'].push(element);
                    } else {
                        columns['main'].push(element);
                    }
                }
            });
        } else {
            columns['main'].push(children);
        }

        if (columns['sidebarMain'].length === 0) {
            columns['sidebarMain'].push(
                <SidebarMain></SidebarMain>
            );
        }

        if (columns['sidebarAdditional'].length === 0) {
            columns['sidebarAdditional'].push(
                <SidebarAdditional></SidebarAdditional>
            );
        }

        return columns;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.meta !== undefined) {
            state['meta'] = { ...state['meta'], ...props.meta };
        }
        state['messages'] = Array.isArray(props.messages) ? props.messages : [];
        state['columns'] = ThreeColumns.getColumns(props.children);
        return state;
    }

    render() {
        return (
            <>
                <DocumentMeta {...this.state.meta}></DocumentMeta>

                <Grid container className="columns">
                    <Grid item xs={12} md={9} xl={10} className="column main">
                        <Header pageTitle={this.props.pageTitle}></Header>
                        <Box id="main-content" className="page-main">
                            <Message></Message>
                            <Grid container>
                                <Grid item xs={12} md={9} xl={10} py={2} pl={2} pr={1} className="content">
                                    <Column blocks={this.state.columns.main}></Column>
                                </Grid>
                                <Grid item xs={12} md={3} xl={2} py={2} pl={1} pr={2} className="sidebar sidebar-additional">
                                    <Column blocks={this.state.columns.sidebarAdditional}></Column>
                                </Grid>
                            </Grid>
                        </Box>
                        <Footer></Footer>
                    </Grid>
                    <Grid item xs={12} md={3} xl={2} className="sidebar sidebar-main">
                        <Column blocks={this.state.columns.sidebarMain}></Column>
                    </Grid>
                </Grid>
                <Dialog></Dialog>
            </>
        );
    };
}
