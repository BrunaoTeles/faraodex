import { headers } from "next/headers";
import MangaReader from "@/components/MangaReader";

export default async function Tumba({ params }) {
    const { id } = await params;
    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto");
    const host = headersList.get("host");
  
    const reqdex = await fetch(`${proto}://${host}/apidex/manga/chapter?query=${id}`);
    if (!reqdex.ok) {
      return (
        <div>
          Faraó está triste com você. Está tentando enganá-lo com identidades
          falsas?
        </div>
      );
    }

    const pages = await reqdex.json();
    const fullpages = pages.chapter.data.map(
        (image) => `${pages.baseUrl}/data/${pages.chapter.hash}/${image}`
    );
    
    return (
        <div>
            <MangaReader pages={fullpages} />
        </div>
    );
}