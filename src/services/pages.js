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
                "pictoaction": baseUrl + resData.pictoaction.data.attributes.url,
                "pictoeducation": baseUrl + resData.pictoeducation.data.attributes.url,
                "pictofederation": baseUrl + resData.pictofederation.data.attributes.url,
                "pages": resData.pagesNavigation.pages,
                "template": resData.pagesNavigation.template
            }
            return config            
        }
    );
}

export default { getPagesTitle, getConfig };