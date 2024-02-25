'use client'
import Survey from "./components/Survey";
export default function Home() {

  function submit(value){
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-16">
      <Survey onSubmit={submit}/>
      {/* <Results results={[]}/> */}
    </main>
  );
}
