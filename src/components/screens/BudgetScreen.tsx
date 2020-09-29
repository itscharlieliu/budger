import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as Edit } from "../../resources/images/edit.svg";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import { addBudgetMonth, deleteBudgetCategory, deleteBudgetGroup } from "../../store/budget/budgetActions";
import { BudgetCategory, TotalBudget } from "../../store/budget/budgetInterfaces";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import getMonthCode from "../../utils/getMonthCode";
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
    toBeBudgeted: number;
    transactions: Transaction[];
    isAddingMonthlyBudget: boolean;
}

interface DispatchProps {
    deleteBudgetCategory: typeof deleteBudgetCategory;
    deleteBudgetGroup: typeof deleteBudgetGroup;
    addBudgetMonth: typeof addBudgetMonth;
}

type AllProps = StateProps & ResolveThunks<DispatchProps>;

interface BudgetCategoryRowProps extends BudgetCategory {
    onDeleteCategory: () => void;
    activity: number;
    categoryName: string;
    monthCode: string;
}

interface BudgetGroupRowProps {
    groupName: string;
    monthCode: string;
    onDeleteGroup: () => void;
}

interface BudgetHeaderProps {
    monthCode: string;
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

const BudgetHeader = (props: BudgetHeaderProps): JSX.Element => {
    const [isAddingGroup, setIsAddingGroup] = useState(false);

    return (
        <>
            <GridHeaderContainer>
                <Modal visible={isAddingGroup} onClose={() => setIsAddingGroup(false)}>
                    <BudgetGroupAddForm monthCode={props.monthCode} onSubmit={() => setIsAddingGroup(false)} />
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

// const BudgetCategoryRow = (props: BudgetCategoryRowProps): JSX.Element => {
//     const [isEditingCategory, setIsEditingCategory] = useState(false);
//
//     return (
//         <>
//             <GridBoxContainer>
//                 <Modal visible={isEditingCategory} onClose={() => setIsEditingCategory(false)}>
//                     <BudgetCategoryEditForm
//                         onSubmit={() => setIsEditingCategory(false)}
//                         budgetCategory={props.categoryName}
//                         defaultValue={formatMoney(props.budgeted.toString(), 2)}
//                         monthCode={props.monthCode}
//                     />
//                 </Modal>
//                 {props.categoryName}
//                 <BudgetAddButton icon={<Edit />} onClick={() => setIsEditingCategory(true)} flat />
//                 <BudgetAddButton icon={<Trash />} onClick={() => props.onDelete(props.categoryName)} flat />
//             </GridBoxContainer>
//             <GridBoxContainer>{props.budgeted}</GridBoxContainer>
//             <GridBoxContainer>{props.activity}</GridBoxContainer>
//             <GridBoxContainer>{props.budgeted + props.activity}</GridBoxContainer>
//         </>
//     );
// };

const BudgetCategoryRow = (props: BudgetCategoryRowProps): JSX.Element => {
    const [isEditingCategory, setIsEditingCategory] = useState(false);

    return (
        <>
            <GridBoxContainer>
                <Modal visible={isEditingCategory} onClose={() => setIsEditingCategory(false)}>
                    <BudgetCategoryEditForm
                        onSubmit={() => setIsEditingCategory(false)}
                        budgetCategory={props.categoryName}
                        defaultValue={formatMoney(props.budgeted.toString(), 2)}
                        monthCode={props.monthCode}
                    />
                </Modal>
                {props.categoryName}
                <BudgetAddButton icon={<Edit />} onClick={() => setIsEditingCategory(true)} flat />
                <BudgetAddButton icon={<Trash />} onClick={() => props.onDeleteCategory()} flat />
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
                    <BudgetCategoryAddForm
                        onSubmit={() => setIsAddingCategory(false)}
                        group={props.groupName}
                        monthCode={props.monthCode}
                    />
                </Modal>
                {props.groupName}
                <BudgetAddButton icon={<PlusIcon />} onClick={() => setIsAddingCategory(true)} flat />
                <BudgetAddButton icon={<Trash />} onClick={() => props.onDeleteGroup()} flat />
            </BudgetGroupContainer>
        </>
    );
};

const BudgetScreen = (props: AllProps): JSX.Element => {
    // TODO change this to state so that we can change months
    const monthCode = getMonthCode(new Date());

    if (!props.totalBudget[monthCode] && !props.isAddingMonthlyBudget) {
        // Month does not exist yet and we are not in the process of creating it, so create it
        props.addBudgetMonth(monthCode);
    }

    const currentMonthlyBudgetKeys = props.totalBudget[monthCode] ? Object.keys(props.totalBudget[monthCode]) : [];

    return (
        <ScreenContainer>
            <BudgetContainer>
                <BudgetHeader monthCode={monthCode} />
                {currentMonthlyBudgetKeys.length === 0 && <InfoCard>{t("noCategories")}</InfoCard>}
                {props.toBeBudgeted > 0 && (
                    <InfoCard>
                        {t("toBeBudgeted")} {props.toBeBudgeted}
                    </InfoCard>
                )}
                {currentMonthlyBudgetKeys.map((budgetGroupName: string, index: number) => (
                    <>
                        <BudgetGroupRow
                            key={"budgetGroup" + index}
                            groupName={budgetGroupName}
                            onDeleteGroup={() => props.deleteBudgetGroup(monthCode, budgetGroupName)}
                            monthCode={monthCode}
                        />
                        {Object.keys(props.totalBudget[monthCode][budgetGroupName]).map(
                            (categoryName: string, index: number) => (
                                <BudgetCategoryRow
                                    key={categoryName + index}
                                    categoryName={categoryName}
                                    monthCode={monthCode}
                                    onDeleteCategory={() => props.deleteBudgetCategory(monthCode, categoryName)}
                                    activity={props.totalBudget[monthCode][budgetGroupName][categoryName].activity}
                                    budgeted={props.totalBudget[monthCode][budgetGroupName][categoryName].budgeted}
                                />
                            ),
                        )}
                    </>
                ))}
            </BudgetContainer>
        </ScreenContainer>
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    totalBudget: state.budget.totalBudget,
    toBeBudgeted: state.budget.toBeBudgeted,
    transactions: state.transaction.transactions,
    isAddingMonthlyBudget: state.budget.isAddingMonthlyBudget,
});

const mapDispatchToProps: DispatchProps = {
    deleteBudgetCategory,
    deleteBudgetGroup,
    addBudgetMonth,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
