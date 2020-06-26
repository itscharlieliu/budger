import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { BudgetCategory, BudgetGroup } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";
import ScreenContainer from "../common/ScreenContainer";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";

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

const BudgetHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: ${theme.font.size.big};
    font-weight: ${theme.font.weight.bold};
    padding: 16px;
    border-bottom: 2px solid ${theme.palette.background.contrast};
`;

const BudgetHeaderButton = styled(Button)`
    margin: -16px 16px;
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
            <BudgetHeaderContainer>
                <span>{t("category")}</span>
                <BudgetHeaderButton icon={<PlusIcon />} flat />
            </BudgetHeaderContainer>
            <BudgetHeaderContainer>{t("budgeted")}</BudgetHeaderContainer>
            <BudgetHeaderContainer>{t("activity")}</BudgetHeaderContainer>
            <BudgetHeaderContainer>{t("remaining")}</BudgetHeaderContainer>
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
