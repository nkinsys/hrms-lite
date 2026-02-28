import DocumentMeta from "react-document-meta";
import Footer from "../fragments/Footer";
import Header from "../fragments/Header";
import Empty from "./Layout";
import Column from "../elements/Column";
import Message from "../fragments/Message";
import PageTitle from "../fragments/PageTitle";
import { Box, Grid } from "@mui/material";
import Dialog from "../fragments/Dialog";

export default class OneColumn extends Empty {
    constructor(props) {
        super(props);

        this.class = "page-layout-1column";
    }

    render() {
        return (
            <>
                <DocumentMeta {...this.state.meta}></DocumentMeta>
                <Grid container className="columns">
                    <Grid item className="column main" xs={12}>
                        <Header></Header>
                        <Box id="main-content" className="page-main">
                            {
                                this.props.pageTitle !== undefined &&
                                <PageTitle title={this.props.pageTitle}></PageTitle>
                            }
                            <Message></Message>
                            <Column blocks={this.state.columns.main}></Column>
                        </Box>
                        <Footer></Footer>
                    </Grid>
                </Grid>
                <Dialog></Dialog>
            </>
        );
    };
}