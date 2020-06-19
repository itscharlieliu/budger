import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { BudgetCategory, BudgetGroup } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";
import Calendar from "react-calendar";
import ScreenContainer from "../common/ScreenContainer";
import DateSelector from "../common/DateSelector";

interface StateProps {
    totalBudget: BudgetGroup[];
}

interface DispatchProps {
    updateBudget: typeof updateBudget;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

const BudgetContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15% 15%;
`;

const BudgetHeaderText = styled.span`
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-bottom: 2px solid ${theme.palette.background.contrast};
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
            <BudgetHeaderText>{t("category")}</BudgetHeaderText>
            <BudgetHeaderText>{t("budgeted")}</BudgetHeaderText>
            <BudgetHeaderText>{t("activity")}</BudgetHeaderText>
            <BudgetHeaderText>{t("remaining")}</BudgetHeaderText>
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
    return (
        <ScreenContainer>
            <DateSelector />
            <Button onClick={() => props.updateBudget(new Date(), "test", "test", 3, 3)}>{t("add")}</Button>
            <BudgetContainer>
                <BudgetHeader />
                {props.totalBudget.map((budgetGroup: BudgetGroup, index: number) => (
                    <BudgetGroupRow key={"budgetGroup" + index} {...budgetGroup} />
                ))}
            </BudgetContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    totalBudget: state.budget.totalBudget,
});

const mapDispatchToProps: DispatchProps = {
    updateBudget,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
