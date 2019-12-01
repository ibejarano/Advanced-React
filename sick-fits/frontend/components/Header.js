import Link from 'next/link';
import styled from 'styled-components';
import Nav from './Nav';

const Logo = styled.h1`
  font-family: 'radnika_next';
  font-size: 3rem;
  margin-left: 3rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  z-index: 2;
  transform: skew(-15deg, -3deg);
  a {
    border-radius: 2.5rem;
    padding: 0.5rem 1rem;
    background: ${props => props.theme.logoColor};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }

  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 1px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Styled Fits</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
    </div>
    <div>Cart</div>
  </StyledHeader>
);

export default Header;
