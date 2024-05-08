import React, { useEffect, useMemo, useState } from 'react';
import './Locations.scss';
import axios from 'axios';
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom';
import { Character } from '../types/Character';
import { Location } from '../types/Location';
import { Pagination } from '../Pagination';
import { Modal } from '../Modal';

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
      setPageArr(Array.apply(null, Array(result.data.data.locations.info.pages)).map(function (y, i) { return i+1; }));
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
        <Pagination 
          setPage={(n: number) => setPage(n)} 
          page={page} 
          pageArr={pageArr}
          closeModule={() => closeModule()}  
        />
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
        <Modal 
          closeModule={closeModule} 
          choosedLocation={choosedLocation}
          charactersFirstThree={charactersFirstThree}
          characters={characters}
          isAllCharacters={isAllCharacters}
          setIsAllCharacters={setIsAllCharacters}
          choosedEpisode={null}
        />
      )}
    </main>
  );
};