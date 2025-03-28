const baseFrontUrl = 'http://85.31.236.134:5177'
const baseBackUrl = 'http://85.31.236.134:1339'

const setUrl = (path:string) => { return baseBackUrl + path }

const seFrontUrl = (path:string) => { return baseFrontUrl + path }

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