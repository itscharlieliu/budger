import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { UNIT_LENGTH } from "../../defs/theme";
import IApplicationState from "../../store";
import { ITotalBudget } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";
import Header from "../common/Header";

const ScreenContainer = styled.div`
    padding: ${UNIT_LENGTH}px;
`;

interface IStateProps {
    totalBudget: ITotalBudget;
}

const BudgetScreen = (): JSX.Element => {
    return (
        <ScreenContainer>
            <Header>Budget</Header>
            <Button onClick={() => console.log("test")}>Hello</Button>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: IApplicationState): IStateProps => ({
    totalBudget: state.budget.totalBudget,
});

export default connect(mapStateToProps, {})(BudgetScreen);
