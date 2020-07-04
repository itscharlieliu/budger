import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { ACCOUNTS, BUDGET, TRANSACTIONS } from "../defs/routerPaths";

import BudgetScreen from "./screens/BudgetScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import AccountScreens from "./screens/AccountsScreen";

const Router = (): JSX.Element => {
    return (
        <Switch>
            <Route path={BUDGET} exact component={BudgetScreen} />
            <Route path={TRANSACTIONS} exact component={TransactionsScreen} />
            <Route path={ACCOUNTS} exact component={AccountScreens} />
            <Redirect to={BUDGET} />
        </Switch>
    );
};

export default Router;
