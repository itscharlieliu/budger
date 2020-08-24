import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as Edit } from "../../resources/images/edit.svg";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { deleteBudgetCategory, deleteBudgetGroup } from "../../store/budget/budgetActions";
import { BudgetCategory, BudgetGroup, TotalBudget } from "../../store/budget/budgetInterfaces";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridBoxContainer from "../common/containers/GridBoxContainer";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import BudgetCategoryAddForm from "../forms/BudgetCategoryAddForm";
import BudgetCategoryEditForm from "../forms/BudgetCategoryEditForm";
import BudgetGroupAddForm from "../forms/BudgetGroupAddForm";

interface StateProps {
    totalBudget: TotalBudget;
    transactions: Transaction[];
}

interface DispatchProps {
    deleteBudgetCategory: typeof deleteBudgetCategory;
    deleteBudgetGroup: typeof deleteBudgetGroup;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

interface BudgetCategoryRowProps extends BudgetCategory {
    onDelete: (category: string) => void;
    activity: number;
}

interface BudgetGroupRowProps extends BudgetGroup {
    onDeleteCategory: (category: string) => void;
    onDeleteGroup: (group: string) => void;
    transactions: Transaction[];
}

const BudgetContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15% 15%;
`;

const BudgetAddButton = styled(Button)`
    margin: -16px 0 -16px 16px;
`;

const BudgetGroupContainer = styled(GridBoxContainer)`
    font-weight: ${theme.font.weight.bold};

    grid-column-start: 1;
    grid-column-end: 5;
`;

const InfoCard = styled.div`
    border-radius: 4px;
    ${theme.shadow.low};
    margin: 16px;
    padding: 16px;

    grid-column-start: 1;
    grid-column-end: 5;
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
            <GridHeaderContainer>
                <span>{t("budgeted")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("activity")}</span>
            </GridHeaderContainer>
            <GridHeaderContainer>
                <span>{t("remaining")}</span>
            </GridHeaderContainer>
        </>
    );
};

const BudgetCategoryRow = (props: BudgetCategoryRowProps): JSX.Element => {
    const [isEditingCategory, setIsEditingCategory] = useState(false);

    return (
        <>
            <GridBoxContainer>
                <Modal visible={isEditingCategory} onClose={() => setIsEditingCategory(false)}>
                    <BudgetCategoryEditForm
                        onSubmit={() => setIsEditingCategory(false)}
                        budgetCategory={props.category}
                        defaultValue={formatMoney(props.budgeted.toString(), 2)}
                    />
                </Modal>
                {props.category}
                <BudgetAddButton icon={<Edit />} onClick={() => setIsEditingCategory(true)} flat />
                <BudgetAddButton icon={<Trash />} onClick={() => props.onDelete(props.category)} flat />
            </GridBoxContainer>
            <GridBoxContainer>{props.budgeted}</GridBoxContainer>
            <GridBoxContainer>{props.activity}</GridBoxContainer>
            <GridBoxContainer>{props.budgeted + props.activity}</GridBoxContainer>
        </>
    );
};

const BudgetGroupRow = (props: BudgetGroupRowProps): JSX.Element => {
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    return (
        <>
            <BudgetGroupContainer>
                <Modal visible={isAddingCategory} onClose={() => setIsAddingCategory(false)}>
                    <BudgetCategoryAddForm onSubmit={() => setIsAddingCategory(false)} group={props.group} />
                </Modal>
                {props.group}
                <BudgetAddButton icon={<PlusIcon />} onClick={() => setIsAddingCategory(true)} flat />
                <BudgetAddButton icon={<Trash />} onClick={() => props.onDeleteGroup(props.group)} flat />
            </BudgetGroupContainer>
            {props.categories.map((category: BudgetCategory) => (
                // TODO This needs to be optimized. It's currently O(n^2).
                <BudgetCategoryRow
                    key={category.category}
                    category={category.category}
                    budgeted={category.budgeted}
                    activity={props.transactions.reduce((totalBalance: number, transaction: Transaction) => {
                        if (transaction.category !== category.category) {
                            return totalBalance;
                        }
                        return totalBalance + transaction.activity;
                    }, 0)}
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
                {props.totalBudget.length === 0 && <InfoCard>{t("noCategories")}</InfoCard>}
                {props.totalBudget.map((budgetGroup: BudgetGroup, index: number) => (
                    <BudgetGroupRow
                        key={"budgetGroup" + index}
                        {...budgetGroup}
                        onDeleteCategory={props.deleteBudgetCategory}
                        onDeleteGroup={props.deleteBudgetGroup}
                        transactions={props.transactions}
                    />
                ))}
            </BudgetContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    totalBudget: state.budget.totalBudget,
    transactions: state.transaction.transactions,
});

const mapDispatchToProps: DispatchProps = {
    deleteBudgetCategory,
    deleteBudgetGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
