import React from "react";
import { connect, ResolveThunks } from "react-redux";

import Input from "../common/Input";
import { importTransactionData } from "../../store/data/dataActions";

interface DispatchProps {
    importTransactionData: typeof importTransactionData;
}

type AllProps = ResolveThunks<DispatchProps>;

const ImportDataForm = (props: AllProps): JSX.Element => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            console.log("no files");
            return;
        }

        props.importTransactionData(event.target.files[0]);
    };

    return <Input type={"file"} onChange={handleFileChange} />;
};

const mapDispatch: DispatchProps = {
    importTransactionData,
};

export default connect(null, mapDispatch)(ImportDataForm);
