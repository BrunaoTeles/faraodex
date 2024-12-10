export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const reqdex = await fetch(`https://api.mangadex.org/manga?title=${query}&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includes[]=cover_art&order[relevance]=desc`, {
        method: "GET",
        headers: {
            "Authority": "api.mangadex.org",
            "Origin": "https://mangadex.org",
            "Referer": "https://mangadex.org/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        }
    });

    if (reqdex.ok)
        return Response.json(await reqdex.json(), { status: 200 });

    return Response.json(await reqdex.json(), { status: 400 });
}