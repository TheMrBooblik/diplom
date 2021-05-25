import React, { useEffect, useState } from "react";
import "./styles.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Snackbar, TextField } from "@material-ui/core";
import { useHttp } from "../../hooks/http.hook";
import { ReaderIndicator } from "../../components/ReaderIndicator";
import Alert from '@material-ui/lab/Alert';

export const wsConnection = new WebSocket("ws://localhost:5000");

export const RegisterPage = () => {
    const { isLoading, request, error, toast, clearError } = useHttp();
    const [isFilled, setFilled] = useState(false);
    const [form, setForm] = useState({
        username: '',
        pwd: '',
        rfid: ''
    })

    React.useEffect(() => {
        setFilled(!!form.username && !!form.pwd && !!form.rfid);
    },[form])

    wsConnection.onmessage = e => {
        setForm({ ...form, rfid: e.data });
    }

    wsConnection.onerror = function(error) {
        alert("Ошибка " + error.message);
    };

    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '30ch',
            },
        },
    }));

    const classes = useStyles();

    const checkFields = () => {

    }

    const changeHandler = (event, type) => {
        setForm({ ...form, [type]: event.target.value });
    }

    const registerHandler = async () => {
        await clearError();
        const data = await request('/api/auth/register', 'POST', { ...form });
        console.log(error)
        setOpen(true);
    }

    return (
        <div className='wrapper'>
            <h2>Register the employee</h2>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField required
                           error={error?.param === "username"}
                           id="first_name"
                           label="Username"
                           variant="outlined"
                           onChange={(e) => changeHandler(e, 'username')}
                           helperText={error?.param === "username" ? error.msg : null}
                />
                <TextField required
                           error={error?.param === "pwd"}
                           id="password"
                           label="Password"
                           variant="outlined"
                           type="password"
                           onChange={(e) => changeHandler(e, 'pwd')}
                           helperText={error?.param === "pwd" ? error.msg : null}
                />
                <ReaderIndicator rfid={form.rfid}/>
                <div>
                    <Button variant="contained"
                            color="primary"
                            component="span"
                            disabled={isLoading || !isFilled}
                            onClick={registerHandler}
                    >
                        Register
                    </Button>
                </div>
            </form>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      open={open}
                      autoHideDuration={5000}
                      onClose={handleClose}>
                <Alert elevation={6}
                       variant="filled"
                       onClose={handleClose}
                       severity={error ? "error" : "success"}
                >
                    {toast}
                </Alert>
            </Snackbar>
        </div>
    )
}