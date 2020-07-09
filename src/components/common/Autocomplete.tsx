import React from "react";
import Input from "./Input";
import Downshift, { useSelect } from "downshift";
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
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
    } = useSelect({ items: props.options });

    return (
        <Downshift onChange={console.log} itemToString={(item: AutocompleteOption) => item.label}>
            {}
            {/*// components={{Control, Menu, Option, MultiValue}}*/}
            {/*// isMulti={props.isMulti}*/}
            {/*// onChange={props.onChange}*/}
            {/*// loadOptions={props.loadOptions}*/}
            {/*// placeholder={props.placeholder}*/}
            {/*// value={props.value}*/}
            {/*// defaultOptions*/}
        </Downshift>
    );
};

export default Autocomplete;
