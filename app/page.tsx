import Image from 'next/image';
import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from '@/components'
import { fetchCars } from '@/utils';
import { fuels, manufacturers, yearsOfProduction } from '@/constants';
import { CarProps } from '@/types';

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams;
  
  const allCars = await fetchCars({
    manufacturer: (params.manufacturer as string) || "",
    year: params.year ? Number(params.year) : undefined,
    fuel: (params.fuel as string) || "",
    model: (params.model as string) || "",
    limit: Number(params.limit) || 10,
  });

  // Ensure allCars is always an array
  const carsArray = Array.isArray(allCars) ? allCars : [];
  
  const currentLimit = Number(params.limit) || 10;
  const displayedCars = carsArray.slice(0, currentLimit);

  const isDataEmpty = carsArray.length < 1;
  const hasMoreCars = carsArray.length > currentLimit;


  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        
        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels}/>
            <CustomFilter title="year" options={yearsOfProduction}/>
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {displayedCars?.map((car: CarProps, index: number) => (
                <CarCard key={index} car={car} />
              ))}
            </div>
            <ShowMore
              pageNumber={currentLimit / 10}
              isNext={!hasMoreCars}
            />




          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">
              Oops, no results
            </h2>
            <p>No cars found. Please try different search parameters.</p>
            <p className="text-sm text-gray-500 mt-2">
              Showing mock data due to API rate limits. Try searching for: Honda, Audi, BMW, Toyota, Ford, etc.
            </p>
          </div>
        )}



      </div>
    </main>
  );
}