import { useCombobox } from "downshift";
import React from "react";

import Input from "./Input";

interface AutocompleteOption {
    value: string;
    label: string;
}

interface AutocompleteProps {
    options: AutocompleteOption[];
}

const Autocomplete = (props: AutocompleteProps): JSX.Element => {
    const { isOpen, getMenuProps, getInputProps, getItemProps, getComboboxProps, inputValue, openMenu } = useCombobox({
        items: props.options,
    });

    return (
        <div {...getComboboxProps()}>
            <Input {...getInputProps({ onFocus: openMenu })} />
            <div {...getMenuProps()}>
                {isOpen &&
                    props.options.reduce((render: JSX.Element[], option: AutocompleteOption) => {
                        if (option.label.toLowerCase().includes(inputValue))
                            render.push(
                                <div key={option.value + option.label + render.length} {...getItemProps}>
                                    {option.label}
                                </div>,
                            );

                        return render;
                    }, [])}
            </div>
        </div>
    );
};

export default Autocomplete;
