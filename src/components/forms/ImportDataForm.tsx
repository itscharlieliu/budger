import React from "react";
import { connect, ResolveThunks } from "react-redux";

import { importData } from "../../store/data/dataActions";
import Input from "../common/Input";

interface DispatchProps {
    importData: typeof importData;
}

type AllProps = ResolveThunks<DispatchProps>;

const ImportDataForm = (props: AllProps): JSX.Element => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            console.log("no files");
            return;
        }

        props.importData(event.target.files[0]);
    };

    return <Input type={"file"} onChange={handleFileChange} />;
};

const mapDispatch: DispatchProps = {
    importData,
};

export default connect(null, mapDispatch)(ImportDataForm);
