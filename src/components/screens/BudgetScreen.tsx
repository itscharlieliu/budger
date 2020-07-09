import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { updateBudget } from "../../store/budget/budgetActions";
import { BudgetCategory, BudgetGroup, TotalBudget } from "../../store/budget/budgetInterfaces";
import Autocomplete from "../common/Autocomplete";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import BudgetCategoryAddForm from "../forms/BudgetCategoryAddForm";
import BudgetGroupAddForm from "../forms/BudgetGroupAddForm";

interface StateProps {
    totalBudget: TotalBudget;
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

const BudgetAddButton = styled(Button)`
    margin: -16px 16px;
`;

const BudgetGroupContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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
    const [isAddingGroup, setIsAddingGroup] = useState(false);

    return (
        <>
            <GridHeaderContainer>
                <Modal visible={isAddingGroup} onClose={() => setIsAddingGroup(false)}>
                    <BudgetGroupAddForm onSubmit={() => setIsAddingGroup(false)} />
                </Modal>
                <span>{t("category")}</span>
                <BudgetAddButton icon={<PlusIcon />} flat onClick={() => setIsAddingGroup(true)} />
            </GridHeaderContainer>
            <GridHeaderContainer>{t("budgeted")}</GridHeaderContainer>
            <GridHeaderContainer>{t("activity")}</GridHeaderContainer>
            <GridHeaderContainer>{t("remaining")}</GridHeaderContainer>
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
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    return (
        <>
            <BudgetGroupContainer>
                <Modal visible={isAddingCategory} onClose={() => setIsAddingCategory(false)}>
                    <BudgetCategoryAddForm onSubmit={() => setIsAddingCategory(false)} group={props.group} />
                </Modal>
                {props.group}
                <BudgetAddButton icon={<PlusIcon />} onClick={() => setIsAddingCategory(true)} flat />
            </BudgetGroupContainer>
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
    const testOptions = [
        {
            value: "test1",
            label: "test1",
        },
        {
            value: "test2",
            label: "test2",
        },
        {
            value: "test3",
            label: "test3",
        },
        {
            value: "test4",
            label: "test4",
        },
        {
            value: "test5",
            label: "test5",
        },
        {
            value: "test6",
            label: "test6",
        },
        {
            value: "test7",
            label: "test7",
        },
        {
            value: "test8",
            label: "test8",
        },
        {
            value: "test9",
            label: "test9",
        },
        {
            value: "test10",
            label: "test10",
        },
    ];

    return (
        <ScreenContainer>
            <Autocomplete options={testOptions} />
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
