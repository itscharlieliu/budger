import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

import { theme } from "../../defs/theme";
import { ReactComponent as LeftArrow } from "../../resources/images/LeftArrow.svg";
import { ReactComponent as RightArrow } from "../../resources/images/RightArrow.svg";
import { ReactComponent as Edit } from "../../resources/images/edit.svg";
import { ReactComponent as PlusIcon } from "../../resources/images/plusIcon.svg";
import { ReactComponent as Trash } from "../../resources/images/trash.svg";
import t from "../../services/i18n/language";
import ApplicationState from "../../store";
import {
    addBudgetMonth,
    deleteBudgetCategory,
    deleteBudgetGroup,
    copyBudgetMonth,
} from "../../store/budget/budgetActions";
import { BudgetCategory, TotalBudget } from "../../store/budget/budgetInterfaces";
import { Transaction } from "../../store/transactions/transactionInterfaces";
import formatMoney from "../../utils/formatMoney";
import {
    getDateFromMonthCode,
    getMonthCodeFromDate,
    getMonthCodeString,
    getNextMonthCode,
    getPrevMonthCode,
    MonthCode,
} from "../../utils/getMonthCode";
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
    copyBudgetMonth: typeof copyBudgetMonth;
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

interface BudgetHeaderProps extends MonthHeaderProps {
    onCopyPreviousMonth: () => void;
}

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

const MonthDisplayContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const MonthText = styled.span`
    margin-left: 16px;
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
        <MonthDisplayContainer>
            <BudgetHeaderButton flat icon={<LeftArrow />} onClick={props.onPrevMonth} />
            <BudgetHeaderButton flat icon={<RightArrow />} onClick={props.onNextMonth} />
            <MonthText>{t("month", { date: getDateFromMonthCode(props.monthCode) })}</MonthText>
        </MonthDisplayContainer>
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
                <BudgetHeaderButton onClick={props.onCopyPreviousMonth}>TEST</BudgetHeaderButton>
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
    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));

    if (!props.totalBudget[getMonthCodeString(monthCode)] && !props.isAddingMonthlyBudget) {
        // Month does not exist yet and we are not in the process of creating it, so create it
        props.addBudgetMonth(monthCode);
    }

    const monthCodeString = getMonthCodeString(monthCode);

    const currentMonthlyBudgetKeys = props.totalBudget[monthCodeString]
        ? Object.keys(props.totalBudget[monthCodeString])
        : [];

    const handleNextMonthPress = () => {
        setMonthCode((currMonth: MonthCode) => getNextMonthCode(currMonth));
    };

    const handlePrevMonthPress = () => {
        setMonthCode((currMonth: MonthCode) => getPrevMonthCode(currMonth));
    };

    const handleCopyPreviousMonth = () => {
        props.copyBudgetMonth(getPrevMonthCode(monthCode), monthCode);
    };

    return (
        <ScreenContainer>
            <BudgetContainer>
                <BudgetHeader
                    monthCode={monthCode}
                    onNextMonth={handleNextMonthPress}
                    onPrevMonth={handlePrevMonthPress}
                    onCopyPreviousMonth={handleCopyPreviousMonth}
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
                        {Object.keys(props.totalBudget[monthCodeString][budgetGroupName]).map(
                            (categoryName: string, index: number) => (
                                <BudgetCategoryRow
                                    key={categoryName + index}
                                    categoryName={categoryName}
                                    monthCode={monthCode}
                                    onDeleteCategory={() => props.deleteBudgetCategory(monthCode, categoryName)}
                                    activity={
                                        props.totalBudget[monthCodeString][budgetGroupName][categoryName].activity
                                    }
                                    budgeted={
                                        props.totalBudget[monthCodeString][budgetGroupName][categoryName].budgeted
                                    }
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
    copyBudgetMonth,
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetScreen);
