import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme, UNIT_LENGTH } from "../../defs/theme";
import IApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { ITotalBudget } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";

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

interface IBudgetCategoryRowProps {
    name: string;
    budgeted: number;
    activity: number;
}

const BudgetCategoryRow = (props: IBudgetCategoryRowProps): JSX.Element => {
    return (
        <>
            <BudgetCategoryText>{props.name}</BudgetCategoryText>
            <BudgetCategoryText>{props.budgeted}</BudgetCategoryText>
            <BudgetCategoryText>{props.activity}</BudgetCategoryText>
            <BudgetCategoryText>{props.budgeted + props.activity}</BudgetCategoryText>
        </>
    );
};

interface IBudgetGroupRowProps {
    group: string;
    categories: IBudgetCategoryRowProps[];
}

const BudgetGroupRow = (props: IBudgetGroupRowProps): JSX.Element => {
    return (
        <>
            <BudgetGroupText>{props.group}</BudgetGroupText>
            {props.categories.map((category: IBudgetCategoryRowProps) => (
                <BudgetCategoryRow
                    key={category.name}
                    name={category.name}
                    budgeted={category.budgeted}
                    activity={category.activity}
                />
            ))}
        </>
    );
};

interface IStateProps {
    totalBudget: ITotalBudget;
}

interface IDispatchProps {
    updateBudget: typeof updateBudget;
}

type TAllProps = IStateProps & ResolveThunks<IDispatchProps>;

const BudgetScreen = (props: TAllProps): JSX.Element => {
    // TODO Replace with with data from redux
    const categories: IBudgetCategoryRowProps[] = [
        {
            name: "test1",
            budgeted: 50,
            activity: -30,
        },
        {
            name: "test2",
            budgeted: 100,
            activity: -60,
        },
    ];

    return (
        <ScreenContainer>
            <Button onClick={() => props.updateBudget(new Date(), "test", "test", 3, 3)}>Hello</Button>
            <BudgetContainer>
                <BudgetHeader />
                <BudgetGroupRow group={"Test group"} categories={categories} />
            </BudgetContainer>
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
