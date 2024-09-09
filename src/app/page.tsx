import { Suspense } from "react";
import GemsList from "../components/gemList";
import { SunIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#121212] text-white">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-bold text-center mb-10 text-[#FFA500] flex items-center justify-center space-x-2">
          <SunIcon className="w-8 h-8 text-[#FFA500]" />
          <span>Praise the RNGesus</span>
          <SunIcon className="w-8 h-8 text-[#FFA500]" />
        </h1>
        <Suspense fallback={<p className="text-center text-gray-400">Loading...</p>}>
          <GemsList />
        </Suspense>
      </div>
    </main>
  );
}
