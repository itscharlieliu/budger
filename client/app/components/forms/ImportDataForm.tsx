import React from "react";

import Input from "../common/Input";

const ImportDataForm = (): JSX.Element => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            console.log("no files");
            return;
        }

        // TODO: Implement file import functionality
        console.log("File selected:", event.target.files[0].name);
    };

    return <Input type={"file"} onChange={handleFileChange} />;
};

export default ImportDataForm;
