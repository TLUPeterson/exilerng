import { Suspense } from "react";
import GemsList from "../components/gemList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className='pb-4'>Praise the RNGesus</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <GemsList />
        </Suspense>
      </div>
    </main>
  );
}
