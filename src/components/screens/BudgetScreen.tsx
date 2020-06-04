import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { UNIT_LENGTH } from "../../defs/theme";
import IApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { IBudgetCategory, IMonthlyBudget, ITotalBudget } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";

const BudgetContainer = (): JSX.Element => {
    return <div>Container</div>;
};

const ScreenContainer = styled.div`
    padding: ${UNIT_LENGTH / 2}px;
`;

interface IStateProps {
    totalBudget: ITotalBudget;
}

interface IDispatchProps {
    updateBudget: typeof updateBudget;
}

type TAllProps = IStateProps & ResolveThunks<IDispatchProps>;

const BudgetScreen = (props: TAllProps): JSX.Element => {
    return (
        <ScreenContainer>
            <Header>Budget</Header>
            <Button onClick={() => props.updateBudget(new Date(), "test", "test", 3, 3)}>Hello</Button>
            <BudgetContainer />
        </ScreenContainer>
    );
};

const mapStateToProps = (state: IApplicationState): IStateProps => ({
    totalBudget: state.budget.totalBudget,
});

const mapDispatchToProps = {
    updateBudget,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
