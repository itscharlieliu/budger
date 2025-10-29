import React, { useState } from "react";
import styled from "styled-components";

import { theme } from "../defs/theme";
import LeftArrow from "../resources/images/LeftArrow.svg";
import RightArrow from "../resources/images/RightArrow.svg";
import Edit from "../resources/images/edit.svg";
import PlusIcon from "../resources/images/plusIcon.svg";
import Trash from "../resources/images/trash.svg";
import t from "../services/i18n/language";
import { BudgetCategory } from "../store/budget/budgetInterfaces";
import formatMoney from "../utils/formatMoney";
import {
    getDateFromMonthCode,
    getMonthCodeFromDate,
    getMonthCodeString,
    getNextMonthCode,
    getPrevMonthCode,
    MonthCode,
} from "../utils/getMonthCode";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import GridBoxContainer from "../components/common/containers/GridBoxContainer";
import GridHeaderContainer from "../components/common/containers/GridHeaderContainer";
import SecureScreenContainer from "../components/common/containers/SecureScreenContainer";
import BudgetCategoryAddForm from "../components/forms/BudgetCategoryAddForm";
import BudgetCategoryEditForm from "../components/forms/BudgetCategoryEditForm";
import BudgetGroupAddForm from "../components/forms/BudgetGroupAddForm";
import { useBudget } from "../hooks/useBudget";
import { useTransactions } from "../hooks/useTransactions";

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
    gap: 16px;
`;

const MonthDisplay = styled.div`
    font-size: 1.5rem;
    font-weight: ${theme.font.weight.bold};
    color: ${theme.palette.background.contrast};
`;

const InfoCard = styled.div`
    grid-column-start: 1;
    grid-column-end: 5;
    padding: 16px;
    background: ${theme.palette.background.main};
    border-radius: 8px;
    margin: 8px 0;
    text-align: center;
    color: ${theme.palette.background.contrast};
`;

const BudgetCategoryRow = (props: BudgetCategoryRowProps): JSX.Element => {
    const [isEditingCategory, setIsEditingCategory] = useState(false);

    return (
        <>
            <Modal visible={isEditingCategory} onClose={() => setIsEditingCategory(false)}>
                <BudgetCategoryEditForm
                    budgetCategory={props.categoryName}
                    monthCode={props.monthCode}
                    onSubmit={() => setIsEditingCategory(false)}
                />
            </Modal>
            <GridBoxContainer>
                <GridHeaderContainer>
                    <Button icon={<Edit />} onClick={() => setIsEditingCategory(true)} flat />
                    {props.categoryName}
                    <Button icon={<Trash />} onClick={() => props.onDeleteCategory()} flat />
                </GridHeaderContainer>
            </GridBoxContainer>
            <GridBoxContainer>{formatMoney(props.budgeted, 2)}</GridBoxContainer>
            <GridBoxContainer>{formatMoney(props.activity, 2)}</GridBoxContainer>
            <GridBoxContainer>{formatMoney(props.budgeted + props.activity, 2)}</GridBoxContainer>
        </>
    );
};

const BudgetGroupRow = (props: BudgetGroupRowProps): JSX.Element => {
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    return (
        <>
            <Modal visible={isAddingGroup} onClose={() => setIsAddingGroup(false)}>
                <BudgetGroupAddForm monthCode={props.monthCode} onSubmit={() => setIsAddingGroup(false)} />
            </Modal>
            <Modal visible={isAddingCategory} onClose={() => setIsAddingCategory(false)}>
                <BudgetCategoryAddForm group={props.groupName} monthCode={props.monthCode} />
            </Modal>
            <BudgetGroupContainer>
                <GridHeaderContainer>
                    <BudgetHeaderButton icon={<PlusIcon />} onClick={() => setIsAddingGroup(true)} flat />
                    {props.groupName}
                    <BudgetHeaderButton icon={<PlusIcon />} onClick={() => setIsAddingCategory(true)} flat />
                    <BudgetHeaderButton icon={<Trash />} onClick={() => props.onDeleteGroup()} flat />
                </GridHeaderContainer>
            </BudgetGroupContainer>
        </>
    );
};

const BudgetHeader = (props: BudgetHeaderProps): JSX.Element => {
    return (
        <>
            <GridHeaderContainer>
                <MonthDisplayContainer>
                    <Button icon={<LeftArrow />} onClick={props.onPrevMonth} flat />
                    <MonthDisplay>{getDateFromMonthCode(props.monthCode).toLocaleDateString()}</MonthDisplay>
                    <Button icon={<RightArrow />} onClick={props.onNextMonth} flat />
                </MonthDisplayContainer>
                <Button onClick={props.onCopyPreviousMonth} flat>
                    {t("copyPreviousMonth")}
                </Button>
            </GridHeaderContainer>
            <GridBoxContainer>{t("category")}</GridBoxContainer>
            <GridBoxContainer>{t("budgeted")}</GridBoxContainer>
            <GridBoxContainer>{t("activity")}</GridBoxContainer>
            <GridBoxContainer>{t("available")}</GridBoxContainer>
        </>
    );
};

const BudgetScreen = (): JSX.Element => {
    const [monthCode, setMonthCode] = useState<MonthCode>(getMonthCodeFromDate(new Date()));
    const {
        totalBudget,
        toBeBudgeted,
        addBudgetMonth,
        deleteBudgetCategory,
        deleteBudgetGroup,
        copyBudgetMonth,
    } = useBudget();
    const { transactions } = useTransactions();

    if (!totalBudget[getMonthCodeString(monthCode)]) {
        // Month does not exist yet, so create it
        addBudgetMonth(monthCode);
    }

    const monthCodeString = getMonthCodeString(monthCode);

    const currentMonthlyBudgetKeys = totalBudget[monthCodeString] ? Object.keys(totalBudget[monthCodeString]) : [];

    const handleNextMonthPress = () => {
        setMonthCode((currMonth: MonthCode) => getNextMonthCode(currMonth));
    };

    const handlePrevMonthPress = () => {
        setMonthCode((currMonth: MonthCode) => getPrevMonthCode(currMonth));
    };

    const handleCopyPreviousMonth = () => {
        copyBudgetMonth(getPrevMonthCode(monthCode), monthCode);
    };

    return (
        <SecureScreenContainer>
            <BudgetContainer>
                <BudgetHeader
                    monthCode={monthCode}
                    onNextMonth={handleNextMonthPress}
                    onPrevMonth={handlePrevMonthPress}
                    onCopyPreviousMonth={handleCopyPreviousMonth}
                />
                {currentMonthlyBudgetKeys.length === 0 && <InfoCard>{t("noCategories")}</InfoCard>}
                {toBeBudgeted !== 0 && (
                    <InfoCard>
                        {t("toBeBudgeted")} {formatMoney(toBeBudgeted, 2)}
                    </InfoCard>
                )}
                {currentMonthlyBudgetKeys.map((budgetGroupName: string, index: number) => (
                    <React.Fragment key={"budgetGroup" + index}>
                        <BudgetGroupRow
                            groupName={budgetGroupName}
                            onDeleteGroup={() => deleteBudgetGroup(monthCode, budgetGroupName)}
                            monthCode={monthCode}
                        />
                        {Object.keys(totalBudget[monthCodeString][budgetGroupName]).map(
                            (categoryName: string, categoryIndex: number) => (
                                <BudgetCategoryRow
                                    key={categoryName + categoryIndex}
                                    categoryName={categoryName}
                                    monthCode={monthCode}
                                    onDeleteCategory={() => deleteBudgetCategory(monthCode, categoryName)}
                                    activity={totalBudget[monthCodeString][budgetGroupName][categoryName].activity}
                                    budgeted={totalBudget[monthCodeString][budgetGroupName][categoryName].budgeted}
                                />
                            ),
                        )}
                    </React.Fragment>
                ))}
            </BudgetContainer>
        </SecureScreenContainer>
    );
};

export default BudgetScreen;
