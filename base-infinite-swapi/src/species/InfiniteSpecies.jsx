import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Species } from './Species';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    isFetching,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
    initialPageParam: initialUrl,
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
