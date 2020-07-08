import React from "react";
import Input from "./Input";
import Select from "react-select";

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
    return (
        <Select
            {...props}
            // components={{Control, Menu, Option, MultiValue}}
            // isMulti={props.isMulti}
            // onChange={props.onChange}
            // loadOptions={props.loadOptions}
            // placeholder={props.placeholder}
            // value={props.value}
            // defaultOptions
        />
    );
};

export default Autocomplete;
