import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Confirm({title, content, autoOpen, confirmbuttonLabel, cancelButtonLabel, callback}) {
    const [open, setOpen] = React.useState(autoOpen === undefined || autoOpen ? true : false);

    const handleClose = (result) => {
        setOpen(false);

        if (typeof callback === 'function') {
            callback(result);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                fullWidth
            >
                <DialogTitle id="confirm-dialog-title" sx={{ fontSize: "1.25rem"}}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="standard" onClick={() => handleClose(false)} sx={{ fontWeight: 600 }}>
                        {cancelButtonLabel ? cancelButtonLabel : "Cancel"}
                    </Button>
                    <Button color="info" variant="contained" onClick={() => handleClose(true)} sx={{ fontWeight: 600 }}>
                        {confirmbuttonLabel ? confirmbuttonLabel : "Ok"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
