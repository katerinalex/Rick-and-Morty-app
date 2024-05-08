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


export type Location = {
  id:	number;
  name:	string;	
  type:	string;
  dimension:	string;
  residents:	Character[];
  url:	string;
  created:	string;
}

export const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [choosedLocation, setChoosedLocation] = useState<Location | null>(null);
  const [isAllCharacters, setIsAllCharacters] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const isLoadedModule = useMemo(() => (choosedLocation?.residents.length || 0) === characters.length, [choosedLocation, characters]);
  const charactersFirstThree = useMemo(() => characters.slice(0, 3), [characters]);
  const [pageArr, setPageArr] = useState<number[]>([]);


  useEffect(() => {
    axios({
      url: 'https://rickandmortyapi.graphcdn.app/',
      method: 'post',
      data: {
        query: `
          query {
            locations(page: ${page}) {
              info {
                count
                pages
              }
              results {
                id
                name
                type
                dimension
                residents {
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
      setPageArr(Array.apply(null, Array(result.data.data.locations.info.pages)).map(function (y, i) { return i+1; }))
      console.log(pageArr);
      setLocations(result.data.data.locations.results);
    }).catch((error) => {
        console.error(error);
      });
  },[page]);

  const chooseLocation = (ep: Location) => {
    setIsAllCharacters(false);
    setCharacters([]);
    setChoosedLocation(null);
    setChoosedLocation(ep);

    for (const ch of ep.residents) {
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
    setChoosedLocation(null);
  };

  return (
    <main className='main'>
      <div className="">
        <h1 className="main__title">Locations</h1>
        <div className="main__pagination">
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--disabled': page === pageArr[0]}
            )}
            to=''
            onClick={() => {
              setPage(pageArr[0]);
              closeModule();
            }}
          >
            &lt;&lt;
          </Link>
          {pageArr.map(pg => (
            <Link 
              className={classNames(
                'main__pagination__item',
                {'main__pagination__item--choosed': page === pg}
              )}
              to=''
              onClick={() => {
                setPage(pg);
                closeModule();
              }}
            >
              {pg}
            </Link>
          ))}
          <Link 
            className={classNames(
              'main__pagination__item',
              {'main__pagination__item--disabled': page === pageArr[pageArr.length - 1]}
            )} 
            to=''
            onClick={() => {
              setPage(pageArr[pageArr.length - 1]);
              closeModule();
            }}
          >
            &gt;&gt;
          </Link>
        </div>
        <ul className="main__list">
          {locations && locations.map(location => (
            <Link 
              className="main__link" 
              to='' 
              key={location.id}
              onClick={() => chooseLocation(location)}
            >
              <li className="main__list__item">
                <img src={logo} alt="" className="main__list__item__image"/>
                <div className="main__list__item__info">
                  <span>{location.id}. {location.name}</span>
                  <span>Dimension: {location.dimension}</span>
                  <span>Type: {location.type}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {choosedLocation && isLoadedModule && (
        <div className="main__module">
          <Link 
            className="main__module__cross" 
            to=''
            onClick={() => closeModule()}
          >
          </Link>
          <img src={logo} alt="" className="main__module__image"/>
          <div className="main__module__info">
            <span>{choosedLocation.id}. {choosedLocation.name}</span>
            <span>Dimension: {choosedLocation.dimension}</span>
            <span>Type: {choosedLocation.type}</span>
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