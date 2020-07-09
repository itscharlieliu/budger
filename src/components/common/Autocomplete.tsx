import { useCombobox } from "downshift";
import React from "react";

import Input from "./Input";
import styled from "styled-components";
import { theme, ZIndex } from "../../defs/theme";

interface AutocompleteOption {
    value: string;
    label: string;
}

interface AutocompleteProps {
    options: AutocompleteOption[];
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
        items: props.options,
        itemToString,
    });

    return (
        <div {...getComboboxProps()}>
            <Input {...getInputProps({ onFocus: openMenu })} />
            <DropDown {...getMenuProps()}>
                {isOpen &&
                    props.options.reduce((render: JSX.Element[], option: AutocompleteOption) => {
                        if (option.label.toLowerCase().includes(inputValue.toLowerCase()))
                            render.push(
                                <DropDownOption
                                    key={option.value + option.label + render.length}
                                    highlight={highlightedIndex === render.length}
                                    {...getItemProps({ item: option, index: render.length })}
                                >
                                    {option.label}
                                </DropDownOption>,
                            );
                        return render;
                    }, [])}
            </DropDown>
        </div>
    );
};

export default Autocomplete;
