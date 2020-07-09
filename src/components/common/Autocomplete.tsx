import React from "react";
import Input from "./Input";
import { useCombobox } from "downshift";
// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";

interface AutocompleteOption {
    value: string;
    label: string;
}

interface AutocompleteProps {
    options: AutocompleteOption[];
    // isMulti?: boolean;
    // onChange?: () => void;
    // placeholder?: string;
    // value?: AutocompleteOption | AutocompleteOption[];
    // loadOptions?: () => void;
}

const Autocomplete = (props: AutocompleteProps): JSX.Element => {
    const { isOpen, getMenuProps, getInputProps, getItemProps, getComboboxProps } = useCombobox({
        items: props.options,
    });

    return (
        <div {...getComboboxProps()}>
            <Input {...getInputProps()} />
            <ul {...getMenuProps()}>
                {isOpen &&
                    props.options.map((option: AutocompleteOption, index: number) => (
                        <li key={option.value + option.label + index} {...getItemProps}>
                            {option.label}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Autocomplete;
