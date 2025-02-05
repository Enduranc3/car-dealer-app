'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Make {
  MakeId: number;
  MakeName: string;
}

const YEARS = Array.from({ length: 11 }, (_, i) => (2015 + i).toString());
const API_URL = `${process.env.NEXT_PUBLIC_NHTSA_API_URL}/vehicles/GetMakesForVehicleType/car?format=json`;
console.log(API_URL);

export default function VehicleForm() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error('Failed to fetch vehicle makes');
        }
        const data = await res.json();
        const sortedMakes = data.Results.sort((a: Make, b: Make) =>
          a.MakeName.localeCompare(b.MakeName)
        );
        setMakes(sortedMakes);
      } catch (error) {
        setError('Failed to load vehicle makes. Please try again later.');
        console.error('Failed to fetch makes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakes().then(make => make);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const isNextDisabled = !selectedMake || !selectedYear;

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="make"
          className="block text-sm font-medium text-gray-700"
        >
          Vehicle Make
        </label>
        <select
          id="make"
          disabled={isLoading}
          value={selectedMake}
          onChange={e => setSelectedMake(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="" className="text-gray-500">
            Select Make
          </option>
          {makes.map(make => (
            <option
              key={make.MakeId}
              value={make.MakeId}
              className="text-gray-900"
            >
              {make.MakeName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Model Year
        </label>
        <select
          id="year"
          disabled={isLoading}
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="" className="text-gray-500">
            Select Year
          </option>
          {YEARS.map(year => (
            <option key={year} value={year} className="text-gray-900">
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="text-sm text-gray-500 text-center">
          Loading vehicle makes...
        </div>
      )}

      <Link
        href={isNextDisabled ? '#' : `/result/${selectedMake}/${selectedYear}`}
        className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm 
          ${
            isNextDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
      >
        Next
      </Link>
    </form>
  );
}
