import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {areYouSureAccept, areYouSureTitle, areYouSureDetails, areYouSure} from "../global/recoilMain";

export default function AreYouSure() {
    const [open, setOpen] = useRecoilState(areYouSure)
    const setAccept = useSetRecoilState(areYouSureAccept)
    const title = useRecoilValue(areYouSureTitle)
    const details = useRecoilValue(areYouSureDetails)
    function handleClick(answer: boolean) {
        setAccept(answer)
        setOpen(false)
    }
    return(
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{height:'100%'}} component='form' onSubmit={() => handleClick(true)}>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {details}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClick(false)} size='small'>Nevermind</Button>
                        <Button type='submit' size='small' autoFocus variant='contained'>
                            confirm
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}