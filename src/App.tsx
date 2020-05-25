import React from "react";
import Header from "./common/components/Header";
import styled from "styled-components";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      Hello world
    </AppContainer>
  );
}

export default App;
