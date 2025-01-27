import styled from 'styled-components';

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  font-size: 1.5rem;
  font-family: 'radnika_next';
  a,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 1em;
    background: none;
    border: 0;
    z-index: 0;
    cursor: pointer;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
    &:after {
      height: 1.4em;
      border-radius: 8px;
      background: lightblue;
      content: '';
      width: 0px;
      position: absolute;
      transform: translateX(-50%) translateY(-90%);
      transition: width 0.2s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 2rem;
      z-index: -1;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 40px);
      }
      @media (max-width: 700px) {
        width: calc(100% - 20px);
      }
    }
  }
  @media (max-width: 1300px) {
    border-top: 1px solid ${props => props.theme.lightgrey};
    width: 100%;
    justify-content: center;
    font-size: 1.5rem;
  }
`;

export default NavStyles;
