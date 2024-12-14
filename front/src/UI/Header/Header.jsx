import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.png`} alt="logo"/>
        </NavLink>
        <NavLink to="/" className="header__title">
          <h1>FixTrack</h1>
        </NavLink>
      </div>
      <nav className="header__nav">
        <NavLink to="/" className="header__nav-link" activeClassName="active">
          Головна
        </NavLink>
        <NavLink to="/services" className="header__nav-link" activeClassName="active">
          Послуги
        </NavLink>
      </nav>
      <div className="header__buttons">
        <button className="button">Зареєструватись</button>
        <button className="button">Увійти</button>
      </div>
    </header>
  );
};

export default Header;
