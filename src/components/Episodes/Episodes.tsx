import React, { useEffect, useMemo, useState } from 'react';
import './Episodes.scss';
import axios from 'axios';
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type Character = {
  id:	number;
  name:	string;
  status:	string;
  species:	string;
  type:	string;
  gender:	string;
  origin:	object;
  location:	object;
  image:	string;
  episode:	string[];
  url:	string ;
  created:	string;
};

type Episode = {
  id:	number;
  name:	string;	
  air_date:	string;	
  episode:	string;
  characters:	string[];
  url:	string;
  created: string;
}

export const Episodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [choosedEpisode, setChoosedEpisode] = useState<Episode | null>(null);
  const [isAllCharacters, setIsAllCharacters] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const isLoadedModule = useMemo(() => (choosedEpisode?.characters.length || 0) === characters.length, [choosedEpisode, characters]);
  const charactersFirstThree = useMemo(() => characters.slice(0, 3), [characters])


  useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`)
    .then((response) => {
      setEpisodes(response.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
  },[page]);

  const chooseEpisode = (ep: Episode) => {
    setIsAllCharacters(false);
    setCharacters([]);
    setChoosedEpisode(null);
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
        <div className="main__pagination">
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--disabled': page === 1}
            )}
            to=''
            onClick={() => {
              setPage(1);
              closeModule();
            }}
          >
            &lt;&lt;
          </Link>
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--choosed': page === 1}
            )}
            to=''
            onClick={() => {
              setPage(1);
              closeModule();
            }}
          >
            1
          </Link>
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--choosed': page === 2}
            )}
            to=''
            onClick={() => {
              setPage(2);
              closeModule();
            }}
          >
            2
          </Link>
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--choosed': page === 3}
            )}
            to=''
            onClick={() => {
              setPage(3);
              closeModule();
            }}
          >
            3
          </Link>
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--disabled': page === 3}
            )} 
            to=''
            onClick={() => {
              setPage(3);
              closeModule();
            }}
          >
            &gt;&gt;
          </Link>
        </div>
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
        <div className="main__module">
          <Link 
            className="main__module__cross" 
            to=''
            onClick={() => closeModule()}
          >
          </Link>
          <img src={logo} alt="" className="main__module__image"/>
          <div className="main__module__info">
            <span>{choosedEpisode.id}. {choosedEpisode.name}</span>
            <span>Episode: {choosedEpisode.episode}</span>
            <span>Date: {choosedEpisode.air_date}</span>
          </div>
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
      )}
    </main>
  );
};