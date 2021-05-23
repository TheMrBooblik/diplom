import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { DetailPage } from "./pages/DetailPage";
import { UsersPage } from "./pages/UsersPage";
import { AuthPage } from "./pages/AuthPage";
import { RegisterPage } from "./pages/RegisterPage";

export const useRoutes = (isAuthenticated, isAdmin) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path={"/detail/:id"}>
                    <DetailPage/>
                </Route>
                <Route path={"/users"} exact>
                    <UsersPage/>
                </Route>
                <Redirect to={"/users"}/>
            </Switch>
        )
    } if (isAuthenticated && !isAdmin) {
        return (
            <Switch>
                <Route path={"/detail/:id"}>
                    <DetailPage/>
                </Route>
                <Redirect to={"/detail/:id"}/>
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path={"/auth"} exact>
                    <AuthPage/>
                </Route>
                <Route path={"/users"} exact>
                    <UsersPage/>
                </Route>
                <Route path={"/register"} exact>
                    <RegisterPage/>
                </Route>
                <Redirect to={"/users"}/>
            </Switch>
        )
    }
}