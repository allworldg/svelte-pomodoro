
function isValid(num, min, max) {
    return isNumeric(num) && isInRange(num, min, max)
}

function isNumeric(num) {
    if (typeof (num) != 'string') return false;
    return num.trim() != '' && !isNaN(num)
}
function isInRange(num, min, max) {
    num = parseInt(num)
    if (num >= min && num <= max) {
        return true;
    } else {
        return false;
    }
}

function setCookie(obj) {
    window.mainAPI.setCookie(obj)
}
function notification(message) {
    window.mainAPI.notification(message)
}

async function getCookie() {
    let cookie = await window.mainAPI.getCookie()
    return cookie
}
function sendIsStarted(message) {
    window.mainAPI.sendIsStarted(message);
}
async function getDefaultAudios(){
    return await window.mainAPI.getDefaultAudios();
}

async function chooseFile() {
    let file = await window.mainAPI.chooseFile();
    return file;
}
export { isNumeric, isValid, isInRange, setCookie, getCookie, notification, sendIsStarted,chooseFile ,getDefaultAudios}
