import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../../defs/theme";
import ApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { BudgetCategory, BudgetGroup } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";

interface StateProps {
    totalBudget: BudgetGroup[];
}

interface DispatchProps {
    updateBudget: typeof updateBudget;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

const ScreenContainer = styled.div`
    flex-grow: 1;
    padding: ${UNIT_LENGTH / 2}px;
`;

const BudgetContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15% 15%;
`;

const BudgetHeaderText = styled.span`
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
`;

const BudgetGroupText = styled.span`
    font-size: ${theme.font.size.small};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};

    grid-column-start: 1;
    grid-column-end: 5;
`;

const BudgetCategoryText = styled.span`
    font-size: ${theme.font.size.small};
    padding: 16px;
    border-top: 1px solid ${theme.palette.divider.main};
`;

const BudgetHeader = (): JSX.Element => {
    return (
        <>
            <BudgetHeaderText>Category</BudgetHeaderText>
            <BudgetHeaderText>Budgeted</BudgetHeaderText>
            <BudgetHeaderText>Activity</BudgetHeaderText>
            <BudgetHeaderText>Remaining</BudgetHeaderText>
        </>
    );
};

const BudgetCategoryRow = (props: BudgetCategory): JSX.Element => {
    return (
        <>
            <BudgetCategoryText>{props.category}</BudgetCategoryText>
            <BudgetCategoryText>{props.budgeted}</BudgetCategoryText>
            <BudgetCategoryText>{props.activity}</BudgetCategoryText>
            <BudgetCategoryText>{props.budgeted + props.activity}</BudgetCategoryText>
        </>
    );
};

const BudgetGroupRow = (props: BudgetGroup): JSX.Element => {
    return (
        <>
            <BudgetGroupText>{props.group}</BudgetGroupText>
            {props.categories.map((category: BudgetCategory) => (
                <BudgetCategoryRow
                    key={category.category}
                    category={category.category}
                    budgeted={category.budgeted}
                    activity={category.activity}
                />
            ))}
        </>
    );
};

const BudgetScreen = (props: AllProps): JSX.Element => {
    // TODO Replace with with data from redux
    // const categories: IBudgetCategory[] = [
    //     {
    //         name: "test1",
    //         budgeted: 50,
    //         activity: -30,
    //     },
    //     {
    //         name: "test2",
    //         budgeted: 100,
    //         activity: -60,
    //     },
    // ];

    return (
        <ScreenContainer>
            <Button onClick={() => props.updateBudget(new Date(), "test", "test", 3, 3)}>Hello</Button>
            <BudgetContainer>
                <BudgetHeader />
                {props.totalBudget.map((budgetGroup: BudgetGroup) => (
                    <BudgetGroupRow
                        key={budgetGroup.group}
                        group={budgetGroup.group}
                        categories={budgetGroup.categories}
                    />
                ))}
            </BudgetContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    totalBudget: state.budget.totalBudget,
});

const mapDispatchToProps = {
    updateBudget,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
