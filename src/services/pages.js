import axios from 'axios';

const baseUrl = 'https://admin.planetearthnow.org';

const getPagesTitle = async () => {
    const request = axios.get(baseUrl + "/api/pages");
    return await request.then(response => 
        response.data.data.map(data => data.attributes)
    );
};

const getConfig = async () => {
    const request = axios.get(baseUrl + "/api/configurations/1?populate=*");
    return await request.then(response => 
        {
            const resData = response.data.data.attributes
            const config = {
                "logo_header_fr": baseUrl + resData.logo_header_fr.data.attributes.url,
                "logo_header_en": baseUrl + resData.logo_header_en.data.attributes.url,
                "logo_footer_fr": baseUrl + resData.logo_footer_fr.data.attributes.url,
                "logo_footer_en": baseUrl + resData.logo_footer_en.data.attributes.url,
                "pages": resData.pagesNavigation.pages,
                "template": resData.pagesNavigation.template,
                "langues": resData.LanguesDisponibles,
                "traduction": resData.traduction,
                "navigation_color": resData.Navigation_color,
                "adresse": resData.adresse,
                "phone_number": resData.Phone_number,
                "profil_instagram": resData.profil_instagram,
                "profil_youtube": resData.profil_youtube,
                "profil_linkedin": resData.profil_linkedin
            }
            return config            
        }
    );
}
const getSingleActionsRoutes = async () => {
  const request = axios.get(baseUrl + `/api/actions`)
  return await request.then(response => {
    return response.data.data
  })
}

const getPageContent = async (params) => {
    const request = axios.get(baseUrl + `/api/${params.page}?locale=${params.lang}&populate=deep`)
    return await request.then(response => {
        return response.data.data.attributes
    });
}
/* const getPageContent = async (params) => {
  console.log(params)

  try {
    const response = await axios.get(`${baseUrl}/api/${params.page}?locale=${params.lang}&populate=deep`);
    var dataToReturn = response

    // Recherche des id pour les actions dans les autres langues
      var idPage = params.page
      if (/^actions/.test(params.page)) {
        var dataLocalisation = response.data.data.attributes.localizations.data
        var localeFiltered = dataLocalisation.filter(locale => { return params.lang === locale.attributes.locale})
        var localeId = localeFiltered[0].id
        dataToReturn = await axios.get(`${baseUrl}/api/${localeId}?locale=${params.lang}&populate=deep`);
      }

    return dataToReturn;
  } catch (error) {
    // Si la langue demandée renvoie une erreur 404, on retente avec "en"
    if (error.response && error.response.status === 404) {
      try {
        const fallbackResponse = await axios.get(`${baseUrl}/api/${params.page}?locale=en&populate=deep`);
        return fallbackResponse.data.data.attributes;
      } catch (fallbackError) {
        console.error('Fallback to "en" also failed:', fallbackError);
        throw fallbackError; // ou retourne un objet vide selon ton besoin
      }
    } else {
      console.error('Erreur lors de la récupération des données :', error);
      throw error;
    }
  }
}; */
/* const getPageContent = async (params) => {

  try {
    // 1. Si langue demandée est "fr", on retourne directement la version française
    if (params.lang === 'fr') {
      const res = await axios.get(`${baseUrl}/api/${params.page}?locale=fr&populate=deep`);
      return res.data.data.attributes;
    }

    // 2. Sinon, on récupère la version française pour chercher les localizations
    const frRes = await axios.get(`${baseUrl}/api/${params.page}?locale=fr&populate=deep`);
    const localizations = frRes.data.data.attributes.localizations?.data || [];

    // 3. On cherche la version traduite
    const match = localizations.find(loc => loc.attributes.locale === params.lang);
    console.log(params)
    console.log(localizations)
    if (match) {
      const localizedRes = await axios.get(`${baseUrl}/api/actions/${match.id}?locale=${params.lang}&populate=deep`);
      return localizedRes.data.data.attributes;
    } else {
      console.warn(`Aucune version disponible pour la langue "${params.lang}", chargement en français`);
      return frRes.data.data.attributes;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    throw error;
  }
}; */
const getActionByDomaine = async (params) => {
    const request = axios.get(baseUrl + `/api/single-actions?filters[domaine][$contains]=${params.domaine}&populate=entete&locale=${params.lang}`)
    return await request.then(response => {
        return Array.from(response.data.data)
    })
}
const getActionById = async (id) => {
    const response = await axios.get(`${baseUrl}/api/single-actions/${id}?populate=deep`);
    return response.data.data;
}

const getLocaleId = async (id, lang) => {
    const response = await axios.get(`${baseUrl}/api/single-actions/${id}?populate=*`);
    const data = response.data.data;
    if (data.attributes.locale === lang) {
      return data.id;
    } else {
      const localization = data.attributes.localizations.data.find((loc) => loc.attributes.locale === lang);
      return localization ? localization.id : id;
    }
  }

const sendForm = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/api/requests`, data);
        return response.data;
    } catch (error) {
        console.error('Error sending form data:', error);
        throw error; 
    }
};

const uploadImage = async (base64String) => {
    // Convertir le Base64 en Blob
    const blob = base64ToBlob(base64String, 'image/png'); // Spécifiez le bon mime type
    const formData = new FormData();
    formData.append('files', blob, 'personnalisation.png'); // 'personnalisation.png' est le nom du fichier
  
    try {
      // Uploader le fichier
      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data[0]; // Retourne l'objet fichier créé
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  // Fonction pour convertir le Base64 en Blob
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };
  const saveFlagOnServer = async (imageBase64) => {
    try {
      // Uploadez l'image
      const uploadedImage = await uploadImage(imageBase64);
      const fileId = uploadedImage.id;
  
      // Associez le fichier à votre entité
      const response = await axios.post(`${baseUrl}/api/flagpersos`, {
        data: {
          personnalisation: fileId, // Utilisez l'ID du fichier ici
        },
      });
  
      console.log("Image et entité sauvegardées avec succès", response.data);
    } catch (error) {
      console.error('Error saving flag:', error);
    }
  };


export default { 
    getPagesTitle, 
    getConfig, 
    getPageContent, 
    sendForm, 
    getActionByDomaine,
    getActionById,
    getLocaleId,
    uploadImage,
    saveFlagOnServer,
    getSingleActionsRoutes
};