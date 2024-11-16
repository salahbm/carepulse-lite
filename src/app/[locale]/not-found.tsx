import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Error Page',
  description: 'This page does not exist',
  // other metadata
};

const ErrorPage = () => {
  return (
    <html className="bg-dark-300">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <Image
            src="/assets/images/404.svg"
            alt="404"
            className="object-contain"
            width={400}
            height={400}
            priority
          />

          <Link
            href="/"
            className="group relative mt-8 inline-block text-sm font-medium text-indigo-700 focus:outline-none focus:ring active:text-orange-500"
          >
            <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-indigo-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

            <span className="relative block border border-current bg-indigo-300 px-8 py-3">
              Go Home
            </span>
          </Link>
        </main>
      </body>
    </html>
  );
};

export default ErrorPage;
