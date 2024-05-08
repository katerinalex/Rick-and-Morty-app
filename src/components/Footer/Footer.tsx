import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className="footer__basic-info">
        <span>Kateryna</span>
        <Link className="footer__basic-info__link" to='https://github.com/katerinalex' target="_blank">My Github</Link>
      </div>
      <div className="footer__tech-stack">
        <span>React.js</span>
        <span>TypeScript</span>
        <span>SCSS</span>
        <span>Axios</span>
        <Link className="footer__tech-stack__link" to='https://rickandmortyapi.com/documentation/' target="_blank">Api</Link>
      </div>
    </footer>
  );
};