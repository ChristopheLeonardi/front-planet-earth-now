import axios from 'axios';

const baseUrl = 'http://85.31.236.134:2222';

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
                "pictoaction": baseUrl + resData.pictoaction.data.attributes.url,
                "pictoeducation": baseUrl + resData.pictoeducation.data.attributes.url,
                "pictofederation": baseUrl + resData.pictofederation.data.attributes.url,
                "pages": resData.pagesNavigation.pages,
                "template": resData.pagesNavigation.template,
                "langues": resData.LanguesDisponibles,
                "traduction": resData.traduction
            }
            return config            
        }
    );
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
export default { 
    getPagesTitle, 
    getConfig, 
    getPageContent, 
    sendForm, 
    getActionByDomaine,
    getActionById,
    getLocaleId 
};