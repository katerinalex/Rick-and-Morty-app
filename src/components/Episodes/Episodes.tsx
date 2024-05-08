import React, { useEffect, useMemo, useState } from 'react';
import './Episodes.scss';
import axios from 'axios';
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom';
import { Character } from '../types/Character';
import { Episode } from '../types/Episode';
import { Pagination } from '../Pagination';
import { Modal } from '../Modal';

export const Episodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [choosedEpisode, setChoosedEpisode] = useState<Episode | null>(null);
  const [isAllCharacters, setIsAllCharacters] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const isLoadedModule = useMemo(() => (choosedEpisode?.characters.length || 0) === characters.length, [choosedEpisode, characters]);
  const charactersFirstThree = useMemo(() => characters.slice(0, 3), [characters]);
  const [pageArr, setPageArr] = useState<number[]>([]);


  useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`)
    .then((response) => {
      setPageArr(Array.apply(null, Array(response.data.info.pages)).map(function (y, i) { return i+1; }));
      setEpisodes(response.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
  },[page]);

  const chooseEpisode = (ep: Episode) => {
    setIsAllCharacters(false);
    setCharacters([]);
    setChoosedEpisode(ep);

    for (const url of ep.characters) {
      axios.get(url)
        .then((response) => {
          setCharacters(prev => [...prev, {
            ...response.data
          }]);
        })
        .catch((error) => {
          console.error(error);
        }); 
    }  
  };

  const closeModule = () => {
    setIsAllCharacters(false);
    setCharacters([]);
    setChoosedEpisode(null);
  };

  return (
    <main className='main'>
      <div className="">
        <h1 className="main__title">Episodes</h1>
        <Pagination 
          setPage={(n: number) => setPage(n)} 
          page={page} 
          pageArr={pageArr}
          closeModule={() => closeModule()}  
        />
        <ul className="main__list">
          {episodes.map(episode => (
            <Link 
              className="main__link" 
              to='' 
              key={episode.id}
              onClick={() => chooseEpisode(episode)}
            >
              <li className="main__list__item">
                <img src={logo} alt="" className="main__list__item__image"/>
                <div className="main__list__item__info">
                  <span>{episode.id}. {episode.name}</span>
                  <span>Episode: {episode.episode}</span>
                  <span>Date: {episode.air_date}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {choosedEpisode && isLoadedModule && (
        <Modal 
          closeModule={closeModule} 
          choosedLocation={null}
          charactersFirstThree={charactersFirstThree}
          characters={characters}
          isAllCharacters={isAllCharacters}
          setIsAllCharacters={setIsAllCharacters}
          choosedEpisode={choosedEpisode}
        />
      )}
    </main>
  );
};