export async function getPreviewData(type: string) {
  const secret = import.meta.env.VITE_STRAPI_PREVIEW_SECRET;
  // TODO : if type, /${entryId}
  const res = await fetch(
    `http://localhost:1337/api/${type}?publicationState=preview&populate=deep`,
    {
/*       headers: {
        Authorization: `Bearer ${secret}`,
      }, */
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return res.json();
}

export async function getPreviewDataAction(type: string, entryId: string) {
  const secret = import.meta.env.VITE_STRAPI_PREVIEW_SECRET;
  // TODO : if type, /${entryId}
  const res = await fetch(
    `http://localhost:1337/api/${type}/${entryId}?publicationState=preview&populate=deep`,
    {
/*       headers: {
        Authorization: `Bearer ${secret}`,
      }, */
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return res.json();
}
