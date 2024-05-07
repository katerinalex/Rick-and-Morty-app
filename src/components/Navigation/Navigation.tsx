import React from 'react';
import './Navigation.scss';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png';

export const Navigation: React.FC = () => {
  const location = useLocation();
  return (
    <nav className='menu'>
      <div className="menu__container">
        <NavLink
          to="/"
          className="logo"
          title="logo"
        >
          <img
            src={logo}
            alt="logo"
            className="logo__image"
          />
        </NavLink>
        <div className="menu__list">
          <NavLink
            to="/"
            className={
              classNames(
                'menu__list__item',
                { 'menu__list__item--is-active': location.pathname.localeCompare('/') === 0 },
              )
            }
          >
            Episodes
          </NavLink>

          <NavLink
            className={
              classNames(
                'menu__list__item',
                { 'menu__list__item--is-active': location.pathname.localeCompare('/characters') === 0 },
              )
            }
            to="/characters"
            title="Characters"
          >
            Characters
          </NavLink>
          <NavLink
            className={
              classNames(
                'menu__list__item',
                { 'menu__list__item--is-active': location.pathname.localeCompare('/locations') === 0 },
              )
            }
            to="/locations"
            title="Locations"
          >
            Locations
          </NavLink>
        </div>
      </div>
    </nav>
  );
};