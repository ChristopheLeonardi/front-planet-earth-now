const baseUrl = 'http://85.31.236.134:'
const portFront = 3333
const portBack = 2222

const setUrl = (path:string) => { return baseUrl + portBack + path }

const seFrontUrl = (path:string) => { return baseUrl + portFront + path }

const getUrlParams = (params:string[]) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var paramsValues:any = {}
    params.map(param => {
        paramsValues[param] = urlParams.get(param)
    })
    return paramsValues
}

const searchIdLang = (data:any, lang:string) => {
    console.log(lang)
    if (data.locale === lang) { return data }

    data.localizations.data.filter((data:any) => {
        return data.attributes.locale === lang
    })[0].id

}

export default {
    setUrl,
    seFrontUrl,
    getUrlParams,
    searchIdLang
}