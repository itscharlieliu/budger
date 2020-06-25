export const UNIT_LENGTH = 64;

export enum ZIndex {
    inputLabel = 10,
    input,
    inactive,
    active,
    calendar,
    modal,
}

export const theme = {
    palette: {
        primary: {
            main: "#aed9e0",
            contrast: "#000000",
        },
        secondary: {
            main: "#ffa69e",
            contrast: "#000000",
        },
        background: {
            main: "#FFFFFF",
            contrast: "#000000",
        },
        divider: {
            main: "#00000020",
        },
        modal: {
            background: "#00000060",
        },
        input: {
            inactive: "#00000080",
            active: "#000000",
            background: "#00000000",
        },
        error: {
            main: "#ff0000",
            light: "#ff000080",
        },
    },
    shadow: {
        none: "-webkit-box-shadow: unset; -moz-box-shadow: unset; box-shadow: unset;",
        low:
            "-webkit-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.5);" +
            "-moz-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.5);" +
            "box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.5);",
        med:
            "-webkit-box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);" +
            "-moz-box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);" +
            "box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);",
        high:
            "-webkit-box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.5);" +
            "-moz-box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.5);" +
            "box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.5);",
    },
    font: {
        size: {
            biggest: "2em",
            bigger: "1.5em",
            big: "1.17em",
            small: "1em",
            smaller: ".83em",
            smallest: ".67em",
        },
        weight: {
            boldest: 900,
            bolder: 700,
            bold: 600,
            none: 500,
        },
    },
};
