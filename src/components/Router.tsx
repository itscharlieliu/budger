import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { BUDGET, TRANSACTIONS } from "../defs/routerPaths";

import BudgetScreen from "./screens/BudgetScreen";
import TransactionsScreen from "./screens/TransactionsScreen";

const Router = (): JSX.Element => {
    return (
        <Switch>
            <Route path={BUDGET} exact component={BudgetScreen} />
            <Route path={TRANSACTIONS} exact component={TransactionsScreen} />
            <Redirect to={BUDGET} />
        </Switch>
    );
};

export default Router;
