import { Suspense } from 'react';
import Link from 'next/link';

interface Model {
  Model_ID: number;
  Model_Name: string;
}

interface ModelResponse {
  Count: number;
  Message: string;
  Results: Model[];
}

interface PageProps {
  params: {
    makeId: string;
    year: string;
  };
}

export const dynamicParams = true;

async function getModels(makeId: string, year: string) {
  if (!makeId || !year) return null;

  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_NHTSA_API_URL}/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}`
    );
    url.searchParams.append('format', 'json');

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ModelResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return null;
  }
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-lg shadow-md animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}

export default async function ResultPage({ params }: PageProps) {
  const makeId = params.makeId;
  const year = params.year;

  if (!makeId || !year || isNaN(Number(makeId)) || isNaN(Number(year))) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid parameters: Make ID and Year must be valid numbers
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to search
          </Link>
        </div>
      </div>
    );
  }

  const data = await getModels(makeId, year);

  if (!data || !data.Results || !Array.isArray(data.Results)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Models Found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Try another search
          </Link>
        </div>
      </div>
    );
  }

  try {
    const models = data?.Results;

    if (!models?.length) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Models Found
            </h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Try another search
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Models
            </h1>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Search
            </Link>
          </div>

          <Suspense fallback={<LoadingState />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model: Model) => (
                <div
                  key={model.Model_ID}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {model.Model_Name}
                  </h2>
                  <p className="text-gray-600 mt-2">Year: {year}</p>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading models
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to search
          </Link>
        </div>
      </div>
    );
  }
}
