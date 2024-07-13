import { Suspense } from "react";
import GemsList from "../components/gemList";
import { SunIcon } from "@radix-ui/react-icons";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#201A23]">
      <div className="w-full max-w-md">
        <h1 className='text-4xl font-bold text-center mb-8 text-[#FFBF1F]'>
          <SunIcon className="inline-block w-6 h-6 mb-1 mx-2 text-[#FFBF1F]" />
            Praise the RNGesus 
          <SunIcon className="inline-block w-6 h-6 mb-1 mx-2 text-[#FFBF1F]" />
        </h1>
        <Suspense fallback={<p className="text-center text-gray-600 text-gray-400">Loading...</p>}>
          <GemsList />
        </Suspense>
      </div>
    </main>
  );
}