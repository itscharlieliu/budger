import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { BudgetCategory, BudgetGroup, TotalBudget } from "../../store/budget/budgetInterfaces";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import BudgetCategoryAddForm from "../forms/BudgetCategoryAddForm";
import BudgetGroupAddForm from "../forms/BudgetGroupAddForm";
import { deleteBudgetCategory } from "../../store/budget/budgetActions";

interface StateProps {
    totalBudget: TotalBudget;
}

interface DispatchProps {
    deleteBudgetCategory: typeof deleteBudgetCategory;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

interface BudgetCategoryRowProps extends BudgetCategory {
    onDelete: (category: string) => void;
}

interface BudgetGroupRowProps extends BudgetGroup {
    onDeleteCategory: (category: string) => void;
    // onDeleteGroup: () => void;
}

const BudgetContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15% 15%;
`;

const BudgetAddButton = styled(Button)`
    margin: -16px 0 -16px 16px;
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

const BudgetCategoryContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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

const BudgetCategoryRow = (props: BudgetCategoryRowProps): JSX.Element => {
    return (
        <>
            <BudgetCategoryContainer>
                {props.category}
                <BudgetAddButton icon={<Trash />} onClick={() => props.onDelete(props.category)} flat />
            </BudgetCategoryContainer>
            <BudgetCategoryContainer>{props.budgeted}</BudgetCategoryContainer>
            <BudgetCategoryContainer>{props.activity}</BudgetCategoryContainer>
            <BudgetCategoryContainer>{props.budgeted + props.activity}</BudgetCategoryContainer>
        </>
    );
};

const BudgetGroupRow = (props: BudgetGroupRowProps): JSX.Element => {
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    console.log(props.categories);

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
                    onDelete={props.onDeleteCategory}
                />
            ))}
        </>
    );
};

const BudgetScreen = (props: AllProps): JSX.Element => {
    return (
        <ScreenContainer>
            <BudgetContainer>
                <BudgetHeader />
                {props.totalBudget.map((budgetGroup: BudgetGroup, index: number) => (
                    <BudgetGroupRow
                        key={"budgetGroup" + index}
                        {...budgetGroup}
                        onDeleteCategory={props.deleteBudgetCategory}
                    />
                ))}
            </BudgetContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    totalBudget: state.budget.totalBudget,
});

const mapDispatchToProps: DispatchProps = {
    deleteBudgetCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
