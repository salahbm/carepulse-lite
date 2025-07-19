import Image from "next/image";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-dark-200 bg-dark-400 shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              height={40}
              width={120}
              alt="CarePulse"
              className="h-8 w-auto"
            />
          </Link>
          <div className="h-9 w-32 animate-pulse rounded-md bg-dark-200" />
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-64 animate-pulse rounded-md bg-gray-200" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="mt-4 h-10 w-40 animate-pulse rounded-md bg-gray-200 sm:mt-0" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex h-48 animate-pulse flex-col rounded-lg border border-dark-200 bg-dark-400 p-4 shadow-sm"
            >
              <div className="mb-2 h-6 w-3/4 rounded-md bg-gray-200" />
              <div className="mb-4 h-4 w-1/2 rounded-md bg-gray-200" />
              <div className="mb-2 h-4 w-full rounded-md bg-gray-200" />
              <div className="mb-2 h-4 w-2/3 rounded-md bg-gray-200" />
              <div className="mt-auto h-8 w-full rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-auto border-t border-dark-200 bg-dark-400 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-dark-500">
          &copy; 2024 CarePulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
