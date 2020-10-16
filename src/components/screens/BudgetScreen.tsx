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
import Button from "../common/Button";
import Modal from "../common/Modal";
import GridBoxContainer from "../common/containers/GridBoxContainer";
import GridHeaderContainer from "../common/containers/GridHeaderContainer";
import ScreenContainer from "../common/containers/ScreenContainer";
import BudgetCategoryAddForm from "../forms/BudgetCategoryAddForm";
import BudgetCategoryEditForm from "../forms/BudgetCategoryEditForm";
import BudgetGroupAddForm from "../forms/BudgetGroupAddForm";
import { getMonthCodeFromDate, getMonthCodeString, MonthCode } from "../../utils/getMonthCode";

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
    monthCode: MonthCode;
}

interface BudgetGroupRowProps {
    groupName: string;
    monthCode: MonthCode;
    onDeleteGroup: () => void;
}

interface MonthHeaderProps {
    monthCode: MonthCode;
    onNextMonth: () => void;
    onPrevMonth: () => void;
}

interface BudgetHeaderProps extends MonthHeaderProps {}

const BudgetContainer = styled.div`
    display: grid;
    width: auto;
    grid-template-columns: auto 15% 15% 15%;
`;

const BudgetHeaderButton = styled(Button)`
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

const MonthDisplay = (props: MonthHeaderProps): JSX.Element => {
    return (
        <div>
            <BudgetHeaderButton icon={<span>prev</span>} onClick={props.onPrevMonth} />
            <span>{props.monthCode}</span>
            <BudgetHeaderButton icon={<span>next</span>} onClick={props.onNextMonth} />
        </div>
    );
};

const BudgetHeader = (props: BudgetHeaderProps): JSX.Element => {
    const [isAddingGroup, setIsAddingGroup] = useState(false);

    return (
        <>
            <GridHeaderContainer>
                <Modal visible={isAddingGroup} onClose={() => setIsAddingGroup(false)}>
                    <BudgetGroupAddForm monthCode={props.monthCode} onSubmit={() => setIsAddingGroup(false)} />
                </Modal>
                <span>{t("category")}</span>
                <BudgetHeaderButton icon={<PlusIcon />} flat onClick={() => setIsAddingGroup(true)} />
                <MonthDisplay
                    monthCode={props.monthCode}
                    onNextMonth={props.onNextMonth}
                    onPrevMonth={props.onPrevMonth}
                />
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
                        budgetCategory={props.categoryName}
                        defaultValue={formatMoney(props.budgeted.toString(), 2)}
                        monthCode={props.monthCode}
                    />
                </Modal>
                {props.categoryName}
                <BudgetHeaderButton icon={<Edit />} onClick={() => setIsEditingCategory(true)} flat />
                <BudgetHeaderButton icon={<Trash />} onClick={() => props.onDeleteCategory()} flat />
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
                <BudgetHeaderButton icon={<PlusIcon />} onClick={() => setIsAddingCategory(true)} flat />
                <BudgetHeaderButton icon={<Trash />} onClick={() => props.onDeleteGroup()} flat />
            </BudgetGroupContainer>
        </>
    );
};

const BudgetScreen = (props: AllProps): JSX.Element => {
    // TODO change this to state so that we can change months
    // const monthCode = getMonthCode(new Date());

    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));

    if (!props.totalBudget[getMonthCodeString(monthCode)] && !props.isAddingMonthlyBudget) {
        // Month does not exist yet and we are not in the process of creating it, so create it
        props.addBudgetMonth(getMonthCodeString(monthCode));
    }

    const currentMonthlyBudgetKeys = props.totalBudget[monthCode] ? Object.keys(props.totalBudget[monthCode]) : [];

    // const handleNextMonthPress = () => {
    //     console.log("next");
    //     setDate((currDate: Date) => {
    //         console.log(currDate);
    //         currDate.setMonth(currDate.getMonth() + 1);
    //         console.log(new Date(currDate));
    //         return new Date(currDate);
    //     });
    // };
    //
    // const handlePrevMonthPress = () => {
    //     console.log("prev");
    //     setDate((currDate: Date) => {
    //         currDate.setMonth(currDate.getMonth() - 1);
    //         return new Date(currDate);
    //     });
    // };

    // TODO Add util to change monthcode

    return (
        <ScreenContainer>
            <BudgetContainer>
                <BudgetHeader
                    monthCode={monthCode}
                    onNextMonth={handleNextMonthPress}
                    onPrevMonth={handlePrevMonthPress}
                />
                {currentMonthlyBudgetKeys.length === 0 && <InfoCard>{t("noCategories")}</InfoCard>}
                {props.toBeBudgeted !== 0 && (
                    <InfoCard>
                        {t("toBeBudgeted")} {formatMoney(props.toBeBudgeted, 2)}
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
