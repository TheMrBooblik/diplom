import React, { useEffect, useState } from "react";
import "./styles.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from "@material-ui/core";
import { useHttp } from "../../hooks/http.hook";

export const AuthPage = () => {
    const { loading, error, request } = useHttp();
    const [form, setForm] = useState({})

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '30ch',
            },
        },
    }));

    const classes = useStyles();

    useEffect(() => {

    },[error])

    const changeHandler = (event, type) => {
        setForm({ ...form, [type]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            console.log('data', data)
        } catch (e) {

        }
    }

    return (
        <div className='wrapper'>
            <h2>Sign In</h2>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField required
                           error={true}
                           id="first_name"
                           label="Username"
                           variant="outlined"
                           onChange={(e) => changeHandler(e, 'username')}
                />
                <TextField required
                           id="first_name"
                           label="Password"
                           variant="outlined"
                           type="password"
                           onChange={(e) => changeHandler(e, 'pwd')}
                />
                <div>
                    <Button variant="contained"
                            color="primary"
                            component="span"
                            disabled={loading}
                            onClick={registerHandler}
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    )
}