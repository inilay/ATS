import styled from 'styled-components';


export const Bracket = styled.div(
    (props) => `
    display: flex;
    flex-direction: row;
    @media (max-width: ${props.mobileBreakpoint}px) {
      flex-direction: column;
    }
    `
  );
  
  export const Round = styled.div(
    (props) => `
    flex: 0;
    // min-width:300px;
    display:flex;
    flex-direction:column;
    @media (max-width: ${props.mobileBreakpoint}px) {
      min-width:0;
    }
    `
  );
  
  export const RoundTitle = styled.div`
    color: #8f8f8f;
    font-weight: 400;
    text-align: center;
  `;
  
  export const SeedsList = styled.div`
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    list-style: none;
  `;