export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const page = request.nextUrl.searchParams.get("page") || 1;
    const reqdex = await fetch(`https://api.mangadex.org/manga/${query}/feed?limit=100&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=${100 * (page - 1)}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`, {
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