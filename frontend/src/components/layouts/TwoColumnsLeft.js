import DocumentMeta from "react-document-meta";
import Footer from "../fragments/Footer";
import Header from "../fragments/Header";
import Empty from "./Layout";
import SidebarMain from "../fragments/SidebarMain";
import Column from "../elements/Column";
import Message from "../fragments/Message";
import { Box, Grid } from "@mui/material";
import Dialog from "../fragments/Dialog";

export default class TwoColumnsLeft extends Empty {
    constructor (props) {
        super(props);

        this.class = "page-layout-2columns-left";
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

        return columns;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.meta !== undefined) {
            state['meta'] = { ...state['meta'], ...props.meta };
        }
        state['messages'] = Array.isArray(props.messages) ? props.messages : [];
        state['columns'] = TwoColumnsLeft.getColumns(props.children);
        return state;
    }

    render() {
        return (
            <>
                <DocumentMeta {...this.state.meta}></DocumentMeta>
                <Grid container className="columns">
                    <Grid size={{ xs: 12, md: 9, xl: 10 }} className="column main">
                        <Header pageTitle={this.props.pageTitle}></Header>
                        <Box px={2} id="main-content" className="page-main">
                            <Message></Message>
                            <Column blocks={this.state.columns.main}></Column>
                        </Box>
                        <Footer></Footer>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3, xl: 2 }} className="sidebar sidebar-main">
                        <Column blocks={this.state.columns.sidebarMain}></Column>
                    </Grid>
                </Grid>
                <Dialog></Dialog>
            </>
        );
    };
}
