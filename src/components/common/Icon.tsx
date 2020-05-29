import styled from "styled-components";

interface IIconProps {
    edge?: "left" | "right";
}

const Icon = styled.div<IIconProps>`
    margin: 16px ${(props: IIconProps) => (props.edge === "right" ? 0 : 16)}px 16px
        ${(props: IIconProps) => (props.edge === "left" ? 0 : 16)}px;
`;

export default Icon;
