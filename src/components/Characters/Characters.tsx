import React, { useEffect, useState } from 'react';
import './Characters.scss';
import axios from 'axios';
import { Character } from '../types/Character';
import { Link } from 'react-router-dom';

export const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/character/?page=${page}&name=${name}&status=${status}&gender=${gender}`)
    .then((response) => {
      setCharacters(prev => [...prev, ...response.data.results]);
      setPagesCount(response.data.info.pages);
    })
    .catch((error) => {
      console.error(error);
    });
  },[name, page, status, gender]);

  const loadCharacters = () => {
    if (page < pagesCount) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <main className='main'>
      <ul className="main__list">
        {characters.map(character => (
          <li className="main__list__item" key={character.id}>
            <img src={character.image} alt="" className="main__list__item__image"/>
            <div className="main__list__item__info">
              <span>{character.name}</span>
              <span>Gender: {character.gender}</span>
              <span>Species: {character.species}</span>
              <span>Status: {character.status}</span>
              <span>Type: {character.type.length > 0 ? character.type : 'Missing' }</span>
            </div>
          </li>
        ))}
        <Link 
          className="main__list__button" 
          to=''
          onClick={() => loadCharacters()}
        >
          Load more characters
        </Link> 
      </ul>
      <div className="main__filter">
        <div className="main__filter__name">
          {/* <label htmlFor="inputText">Type name of character: </label>  */}
          <input 
            type="text" 
            id="inputText"
            value={inputText}
            placeholder='Find character by name'
            onChange={e => {
              setCharacters([]);
              setName(e.target.value.trim().toLocaleLowerCase());
              setPage(1);
              setInputText(e.target.value); 
            }}
          />
        </div>

        <div className="main__filter__status">
          <label htmlFor="inputSelect">Choose status of character: </label> 
          <select
            id="inputSelect"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCharacters([]);
              setPage(1);
            }}
          >
            <option value="">all</option>
            <option value="alive">alive</option>
            <option value="dead">dead</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        <div className="main__filter__gender">
          <label htmlFor="inputGender">Choose gender of character: </label> 
          <select
            id="inputGender"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setCharacters([]);
              setPage(1);
            }}
          >
            <option value="">all</option>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="genderless">genderless</option>
            <option value="unknown">unknown</option>
          </select>
        </div>
      </div>
    </main>
  );
};