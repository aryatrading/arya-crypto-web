export function getParameterByName(paramName: string, url = window.location.href) {
    paramName = paramName.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}