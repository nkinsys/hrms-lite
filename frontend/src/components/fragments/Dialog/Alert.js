import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Alert({ title, content, autoOpen, buttonLabel, callback }) {
    const [open, setOpen] = React.useState(autoOpen === undefined || autoOpen ? true : false);

    const handleClose = () => {
        setOpen(false);

        if (typeof callback === 'function') {
            callback();
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.25rem" }}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" variant="contained" onClick={handleClose} sx={{ fontWeight: 600 }}>
                        {buttonLabel ? buttonLabel : "Ok"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
