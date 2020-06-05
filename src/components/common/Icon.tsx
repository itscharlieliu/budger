import styled from "styled-components";

interface IconProps {
    edge?: "left" | "right";
}

const Icon = styled.div<IconProps>`
    margin: 16px ${(props: IconProps) => (props.edge === "right" ? 0 : 16)}px 16px
        ${(props: IconProps) => (props.edge === "left" ? 0 : 16)}px;
`;

export default Icon;
