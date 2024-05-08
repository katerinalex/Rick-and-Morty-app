import React from 'react';
import './Modal.scss';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import { Location } from '../types/Location';
import { Character } from '../types/Character';
import { Episode } from '../types/Episode';

type Props = {
  closeModule: () => void;
  choosedLocation: Location | null;
  charactersFirstThree: Character[];
  characters: Character[];
  isAllCharacters: boolean;
  setIsAllCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  choosedEpisode: Episode | null
}

export const Modal: React.FC<Props> = ({closeModule, choosedLocation, charactersFirstThree, characters, isAllCharacters, setIsAllCharacters,choosedEpisode}) => {
  return (
    <div className="main__module">
      <Link 
        className="main__module__cross" 
        to=''
        onClick={() => closeModule()}
      >
      </Link>
      <img src={logo} alt="" className="main__module__image"/>
      {choosedLocation && (
        <div className="main__module__info">
          <span>{choosedLocation.id}. {choosedLocation.name}</span>
          <span>Dimension: {choosedLocation.dimension}</span>
          <span>Type: {choosedLocation.type}</span>
        </div>
      )}
      {choosedEpisode && (
        <div className="main__module__info">
          <span>{choosedEpisode.id}. {choosedEpisode.name}</span>
          <span>Episode: {choosedEpisode.episode}</span>
          <span>Date: {choosedEpisode.air_date}</span>
        </div>
      )}
      <div className="main__module__characters">
        {!isAllCharacters && charactersFirstThree.map(character => (
          <div className="main__module__characters__item" key={character.id}>
            <img src={character.image} alt="" className="main__module__characters__item__image"/>
            <div className="main__module__characters__item__info">
              <span>{character.name}</span>
              <span>Species: {character.species}</span>
              <span>Gender: {character.gender}</span>
            </div>
          </div>
        ))}
        {isAllCharacters && characters.map(character => (
          <div className="main__module__characters__item" key={character.id}>
            <img src={character.image} alt="" className="main__module__characters__item__image"/>
            <div className="main__module__characters__item__info">
              <span>{character.name}</span>
              <span>Species: {character.species}</span>
              <span>Gender: {character.gender}</span>
            </div>
          </div>
        ))}
      </div>

      {!isAllCharacters && (
        <Link 
          className="main__module__add-char" 
          to=''
          onClick={() => setIsAllCharacters(true)}
        >
          Load more characters
        </Link> 
      )}
    </div>
  );
};