import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { BUDGET } from "../defs/routerPaths";
import BudgetScreen from "./screens/BudgetScreen";

const Router = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={BUDGET} exact component={BudgetScreen} />
                <Redirect to={BUDGET} />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;
