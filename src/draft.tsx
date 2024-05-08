import React, { useEffect, useMemo, useState } from 'react';
import './Locations.scss';
import axios from 'axios';
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export type Character = {
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

export type Episode = {
  id:	number;
  name:	string;	
  air_date:	string;	
  episode:	string;
  characters:	Character[];
  url:	string;
  created: string;
}

export const Locations: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [choosedEpisode, setChoosedEpisode] = useState<Episode | null>(null);
  const [isAllCharacters, setIsAllCharacters] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const isLoadedModule = useMemo(() => (choosedEpisode?.characters.length || 0) === characters.length, [choosedEpisode, characters]);
  const charactersFirstThree = useMemo(() => characters.slice(0, 3), [characters])


  useEffect(() => {
    // axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`)
    // .then((response) => {
    //   setEpisodes(response.data.results);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    axios({
      url: 'https://rickandmortyapi.graphcdn.app/',
      method: 'post',
      data: {
        query: `
          query {
            episodes(page: ${page}) {
              info {
                count
              }
              results {
                id
                name
                air_date
                episode
                characters {
                  id
                  name
                }
                created
              }
            }
          }
          `
      }
    }).then((result) => {
      setEpisodes(result.data.data.episodes.results);
    }).catch((error) => {
        console.error(error);
      });
  },[page]);

  const chooseEpisode = (ep: Episode) => {
    setIsAllCharacters(false);
    setCharacters([]);
    setChoosedEpisode(null);
    setChoosedEpisode(ep);


    // console.log(ep);
    // console.log(ep.characters);
    for (const ch of ep.characters) {
      // console.log(ep.characters);
      console.log(ch.name);
      if(ch.name.length) {
        axios({
          url: 'https://rickandmortyapi.graphcdn.app/',
          method: 'post',
          data: {
            query: `
              {
                characters(page: 1, filter: {name: "${ch.name}"}) {
                  info {
                    count
                  }
                  results {
                    id
                    name
                    status
                    species
                    type
                    gender
                    image
                    created
                  }
                }
              }
            `
          }
        }).then((result) => { 
          setCharacters(prev => [...prev, result.data.data.characters.results.find((el:Character) => el.id === ch.id)]);
        }).catch((error) => {
            console.error(error);
        });
      }
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
          {episodes && episodes.map(episode => (
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