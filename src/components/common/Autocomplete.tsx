import { useCombobox, UseComboboxState } from "downshift";
import React from "react";
import styled from "styled-components";

import { theme, ZIndex } from "../../defs/theme";

import Input, { InputProps } from "./Input";
import { Omit } from "react-redux";

export interface AutocompleteOption {
    value: string;
    label: string;
}

type AutocompleteInputProps = Omit<InputProps, "onChange" | "value">;

export interface AutocompleteProps extends AutocompleteInputProps {
    options: AutocompleteOption[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement> | AutocompleteOption) => void;
    onSelectedItemChange?: (changes: Partial<UseComboboxState<AutocompleteOption>>) => void;
    value?: AutocompleteOption;
}

interface DropDownOptionProps {
    highlight: boolean;
}

const DropDown = styled.div`
    position: absolute;
    max-height: 40vh;
    overflow: auto;
    background-color: white;
    border-radius: 4px;
    ${theme.shadow.med};
    z-index: ${ZIndex.dropdown};
`;

const DropDownOption = styled.div<DropDownOptionProps>`
    padding: 16px;
    background-color: ${(props: DropDownOptionProps) =>
        props.highlight ? theme.palette.primary.main : theme.palette.background.main};
    color: ${(props: DropDownOptionProps) =>
        props.highlight ? theme.palette.primary.contrast : theme.palette.background.contrast};
`;

const Autocomplete = (props: AutocompleteProps): JSX.Element => {
    const { options, value, onFocus, onChange, onSelectedItemChange, ...otherInputProps } = props;

    const itemToString = (item: AutocompleteOption | null): string => {
        if (!item) {
            return "";
        }

        return item.label;
    };

    const {
        isOpen,
        highlightedIndex,
        getMenuProps,
        getInputProps,
        getItemProps,
        getComboboxProps,
        inputValue,
        openMenu,
    } = useCombobox({
        items: options,
        itemToString,
        onSelectedItemChange: (changes: Partial<UseComboboxState<AutocompleteOption>>) => {
            onChange && changes.selectedItem && onChange(changes.selectedItem);
            onSelectedItemChange && onSelectedItemChange(changes);
        },
    });

    const onInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        openMenu();
        onFocus && onFocus(event);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onChange && onChange({ value, label: value });
    };

    return (
        <div {...getComboboxProps()}>
            <Input
                {...getInputProps({
                    onFocus: onInputFocus,
                    value: value ? value.label : undefined,
                    onChange: handleInputChange,
                    ...otherInputProps,
                })}
            />
            <DropDown {...getMenuProps()}>
                {isOpen &&
                    props.options.reduce((render: JSX.Element[], option: AutocompleteOption, index: number) => {
                        if (option.label.toLowerCase().includes(inputValue.toLowerCase())) {
                            render.push(
                                <DropDownOption
                                    key={option.value + option.label + index}
                                    highlight={highlightedIndex === index}
                                    {...getItemProps({ item: option, index: index })}
                                >
                                    {option.label}
                                </DropDownOption>,
                            );
                        }
                        return render;
                    }, [])}
            </DropDown>
        </div>
    );
};

export default Autocomplete;
