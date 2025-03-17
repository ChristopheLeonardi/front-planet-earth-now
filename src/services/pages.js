import axios from 'axios';

const baseUrl = 'http://localhost:1337';

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
                "logo": baseUrl + resData.logo.data.attributes.url,
                "pages": resData.pagesNavigation.pages,
                "template": resData.pagesNavigation.template,
                "langues": resData.LanguesDisponibles,
                "traduction": resData.traduction,
                "navigation_color": resData.Navigation_color,
                "adresse": resData.adresse,
                "phone_number": resData.Phone_number
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