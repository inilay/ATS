import styled from 'styled-components';


export const SeedItem = styled.div`
  color: inherit;
  width: 100%;
  background: inherit;
  padding: 0;
  text-align: center;
  position: relative;
`;

export const SeedTeam = styled.div`
 
  padding: 0.2rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: center;

`;

export const SeedTime = styled.div(
  (props) => `
  margin-top: 2px;
  font-size: 12px;
  color: inherit;
  height: 0;
  @media (max-width: ${props.mobileBreakpoint}px) {
    height:auto;
  }
  `
);

/*
 * Difference between "SingleLineSeed" and "Seed" is that single line seed
 * will directly connect to the next node, it's good for double elimination losing brackets.
 *
 * The best behavior in such case is, to check if the next round seeds matches the current round seeds
 */

export const SingleLineSeed = styled.div(
  (props) => `
    padding: 1em 1.5em;
    min-width: 225px;
    width:100%;
    position: relative;
    display: flex;
    align-items: center;
    flex: 0 1 auto;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    @media (max-width: ${props.mobileBreakpoint}px) {
      width:100%;
    }
    @media (min-width: ${(props.mobileBreakpoint || 0) + 1}px) {
      &::after {
          content: "";
          position: absolute;
          height: 50%;
          width: 3em;
          right: -1.5em;
        [dir="rtl"] & {
          left: -1.5em;
        }
        [dir="ltr"] & {
          right: -1.5em;
        }
      }
      &:nth-child(even)::after {
        border-bottom: 1px solid #707070;
        top: -6px;
      }
      &:nth-child(odd)::after {
        border-top: 1px solid #707070;
        top: calc(50% - 6px);
      }
  }
`
);

export const Seed = styled.div(
  (props) => `
  padding: 0.1em 1.5em;
  min-width: 225px;
  width:100%;
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  @media (max-width: ${props.mobileBreakpoint}px) {
    width:100%;
  }
  @media (min-width: ${(props.mobileBreakpoint || 0) + 1}px) {
    &::after {
        content: "";
        position: absolute;
        height: 50%;
        width: 1.5em;
        right: 0px;
      [dir="rtl"] & {
        left: 0px;
      }
      [dir="ltr"] & {
        right: 0px;
      }
    }
    &:nth-child(even)::before{
      content:'';
      border-top: 1px solid #707070;
      position:absolute;
      top: -6px;
      width:1.5em;
      right:-1.5em;
      [dir="rtl"] & {
        left:-1.5em;
        }
      [dir="ltr"] & {
        right:-1.5em;
      }
    }
    &:nth-child(even)::after {
      border-bottom: 1px solid #707070;
      top: -6px;
      border-right: 1px solid #707070;
     [dir="rtl"] & {
        border-left: 1px solid #707070;
        }
      [dir="ltr"] & {
        border-right: 1px solid #707070;
      }
    }
    &:nth-child(odd):not(:last-child)::after {
      border-top: 1px solid #707070;
      top: calc(50% - 6px);
      border-right: 1px solid #707070;
      [dir="rtl"] & {
        border-left: 1px solid #707070;
        }
      [dir="ltr"] & {
        border-right: 1px solid #707070;
      }
    }
}
`
);