export const unitLength = 64;

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
    },
    size: {
        appBar: {
            width: "100%",
            height: `${unitLength}px`,
        },
        drawer: {
            width: `${unitLength * 4}px`,
            height: "100%",
        },
    },
    shadow: {
        low:
            "-webkit-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.5);-moz-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.5);box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.5);",
        med:
            "-webkit-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.5);-moz-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.5);box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.5);",
        high:
            "-webkit-box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.5);-moz-box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.5);box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.5);",
    },
};
