
function isValid(num) {
    return isNumeric(num) && isInRange(num)
}

function isNumeric(num) {
    if (typeof (num) != 'string') return false;
    return num.trim() != '' && !isNaN(num)
}
function isInRange(num) {
    if (num >= 0 && num <= 240) {
        return true;
    } else {
        return false;
    }
}

function setCookie(obj) {
    window.mainAPI.setCookie(obj)
}

async function getCookie() {
    let cookie = await window.mainAPI.getCookie()
    return cookie
}
export { isNumeric, isValid, isInRange, setCookie, getCookie }
