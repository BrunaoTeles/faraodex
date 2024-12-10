"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleFetchSearch() {
    if (!search.trim()) return alert("Por favor, insira algo para buscar.");
    setLoading(true);
    try {
      const reqdex = await fetch(`/apidex/search?query=${search}`);
      if (reqdex.ok) {
        setResults(await reqdex.json());
      } else {
        alert("A busca falhou, ó grande faraó.");
      }
    } catch (error) {
      alert("Erro inesperado durante a busca.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/brand.png"
          width={400}
          height={400}
          quality={100}
          alt="Faraódex"
        />
        <div className="max-w-6xl w-full mt-5">
          <div className="flex gap-4 items-center">
            <input
              className="w-full outline-none border border-yellow-500 p-3 rounded-lg text-black bg-yellow-100 focus:ring-2 focus:ring-yellow-400 transition duration-200"
              type="text"
              placeholder="Digite o nome do mangá"
              value={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFetchSearch();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleFetchSearch}
              disabled={loading}
              className={`font-extrabold p-3 rounded-lg transition duration-300 ${
                loading
                  ? "bg-yellow-300 text-yellow-800 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              {loading ? (
                <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-t-transparent border-yellow-800"></div>
              ) : (
                "BUSCAR"
              )}
            </button>
          </div>
          <div className="mt-5 grid grid-cols-5 gap-4">
            {results.data?.map((result) => (
              <Link
                href={`/imperador/${result.id}`}
                className="h-auto transition duration-300 group hover:-translate-y-2"
                key={result.id}
              >
                <Image
                  className="select-none w-[300px] h-[300px]"
                  src={`https://mangadex.org/covers/${result.id}/${result.relationships.find(
                    (relation) => relation.type === "cover_art"
                  )?.attributes.fileName}`}
                  width={1000}
                  height={1000}
                  alt={result.attributes.title.en}
                  quality={100}
                />
                <h2 className="select-none font-extrabold text-yellow-300 mt-2">
                  {result.attributes.title.en}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="top-0 left-0 z-[-10] h-screen w-full bg-[url('/fundo.png')] bg-center bg-cover bg-no-repeat pointer-events-none fixed">
        <div className="absolute inset-0 bg-black opacity-70" />
      </div>
    </div>
  );
}
