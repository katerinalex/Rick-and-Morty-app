import React from 'react';
import './Pagination.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type Props = {
  setPage: (n: number) => void;
  page: number;
  pageArr: number[];
  closeModule: () => void;
}

export const Pagination: React.FC<Props> = ({setPage, page, pageArr, closeModule}) => {
  return (
    <div className="main__pagination">
      <Link 
        className={classNames(
          'main__pagination__item',
          {'main__pagination__item--disabled': page === pageArr[0]}
        )}
        to=''
        onClick={() => {
          setPage(page - 1);
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
          key={pg}
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
          setPage(page + 1);
          closeModule();
        }}
      >
        &gt;&gt;
      </Link>
    </div>
  );
};