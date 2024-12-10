import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto");
  const host = headersList.get("host");

  const reqdex = await fetch(`${proto}://${host}/apidex/manga?query=${id}`);
  if (!reqdex.ok) {
    return {
      title: "Faraó Está Bravo",
      description: "Não foi possível carregar as informações do manga, viva o império.",
    };
  }

  const { data: result } = await reqdex.json();
  
  return {
    title: result.attributes.title.en,
    description: result.attributes.description.en || "Sem descrição disponível.",
    openGraph: {
      title: result.attributes.title.en,
      description: result.attributes.description.en || "Sem descrição disponível.",
      images: [
        {
          url: `https://mangadex.org/covers/${result.id}/${result.relationships.find(
            (relation) => relation.type === "cover_art"
          )?.attributes.fileName}`,
          width: 1200,
          height: 630,
          alt: result.attributes.title.en,
        },
      ],
    },
  };
}

export default async function Imperador({ params, searchParams }) {
  const { id } = await params;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto");
  const host = headersList.get("host");
  const { page } = searchParams;

  const reqdex = await fetch(`${proto}://${host}/apidex/manga?query=${id}`);
  if (!reqdex.ok) {
    return (
      <div>
        Faraó está triste com você. Está tentando enganá-lo com identidades
        falsas?
      </div>
    );
  }

  const { data: result } = await reqdex.json();
  const reqdexchap = await fetch(`${proto}://${host}/apidex/manga/chapters?query=${id}&page=${page ? parseInt(page) : 1}`);
  const resultChapters = await reqdexchap.json();
  
  const totalChapters = resultChapters.total;
  const limit = 100;
  const totalPages = Math.ceil(totalChapters / limit);

  const genres = result.attributes.tags.filter((tag) => tag.attributes.group === "genre");
  const themes = result.attributes.tags.filter((tag) => tag.attributes.group === "theme");
  const formats = result.attributes.tags.filter((tag) => tag.attributes.group === "format");
  
  const groupedChapters = resultChapters.data.reduce((acc, chap) => {
    const languageMap = {
      "pt-br": "br",
      "en": "gb",
    };
    const language = languageMap[chap.attributes.translatedLanguage] || chap.attributes.translatedLanguage;
    if (!acc[language]) acc[language] = [];
    acc[language].push(chap);
    return acc;
  }, {});

  const pageButtons = [];
  const currentPage = page ? parseInt(page) : 1;

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pageButtons.push(i);
  }

  return (
    <div>
      <div className="relative z-0 h-[300px] w-full">
        <Image
          className="select-none object-cover inset-0 w-full h-full filter blur-sm"
          src={`https://mangadex.org/covers/${result.id}/${result.relationships.find(
            (relation) => relation.type === "cover_art"
          )?.attributes.fileName}`}
          width={1000}
          height={1000}
          alt={result.attributes.title.en}
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative -mt-[220px] px-10 z-10">
        <div className="flex gap-4">
          <div className="w-[200px] h-[300px] rounded-md shadow-lg overflow-hidden border border-gray-800">
            <Image
              className="select-none w-full h-full object-cover"
              src={`https://mangadex.org/covers/${result.id}/${result.relationships.find(
                (relation) => relation.type === "cover_art"
              )?.attributes.fileName}`}
              width={1000}
              height={1000}
              alt={result.attributes.title.en}
              quality={100}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-6xl font-extrabold text-white drop-shadow-md">
                {result.attributes.title.en}
              </h1>
            </div>
            <div className="flex flex-wrap -mt-[50px] gap-2">
              {result.attributes.tags.map((tag) => (
                <p className="bg-gray-200 rounded-full p-2 text-xs" key={tag.id}>{tag.attributes.name.en}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="text-black mt-5">
          <p className="font-semibold mb-5">{result.attributes.year && `PUBLICADO EM: ${result.attributes.year}, `} {result.attributes.status.toUpperCase()}</p>
          <p>{result.attributes.description.en}</p>

          <div className="mt-5 flex justify-between gap-10">
            <div>
              <div>
                <p className="font-semibold text-lg mb-2">Autor</p>
                <p className="rounded text-xs bg-gray-200 w-[max-content] p-2">{result.relationships.find((relation) => relation.type === "author")?.attributes.name}</p>
              </div>
              <div className="mt-5">
                <p className="font-semibold text-lg mb-2">Gêneros</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {genres.map((genre) => (
                    <p key={genre.id} className="rounded text-xs bg-gray-200 w-[max-content] p-2">{genre.attributes.name.en}</p>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <p className="font-semibold text-lg mb-2">Temas</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {themes.map((theme) => (
                    <p key={theme.id} className="rounded text-xs bg-gray-200 w-[max-content] p-2">{theme.attributes.name.en}</p>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <p className="font-semibold text-lg mb-2">Formatos</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {formats.map((format) => (
                    <p key={format.id} className="rounded text-xs bg-gray-200 w-[max-content] p-2">{format.attributes.name.en}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {Object.entries(groupedChapters).map(([language, chapters]) => (
                <div key={language} className="bg-gray-200 p-4 rounded shadow-md">
                  <Image src={`https://mangadex.org/img/flags/${language}.svg`} width={30} height={30} quality={100} alt={language} />
                  {chapters.map((chap) => {
                    const scanGroup = chap.relationships.find(
                      (rel) => rel.type === "scanlation_group"
                    )?.attributes.name || "Sem grupo";
                    const uploader = chap.relationships.find(
                      (rel) => rel.type === "user"
                    )?.attributes.username || "Não se sabe";

                    return (
                      <div key={chap.id} className="mt-2 bg-gray-100 p-2 rounded">
                        <Link href={`/tumba/${chap.id}`}>
                          <p className="text-sm font-semibold">{`Cáp. ${
                            chap.attributes.chapter || "OneShot"
                          }: ${chap.attributes.title || "Sem nome"}`}</p>
                          <p className="text-xs text-gray-600">
                            Grupo: {scanGroup} | Publicadora: {uploader}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="my-5 flex justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Anterior
              </Link>
            )}
            {pageButtons.map((pageNum) => (
              <Link
                key={pageNum}
                href={`?page=${pageNum}`}
                className={`px-4 py-2 rounded ${pageNum === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {pageNum}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
