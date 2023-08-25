function sleep(ms) {
    return new Promise(res => {
        setTimeout(() => {
            res()
        }, ms * 1000);
    })
}

function isNumeric(num) {
    if (typeof (num) != 'string') return false;
    return !isNaN(num)
}

// function setCookie(obj) {
//     const Cookie = session.defaultSession.cookies
//     Cookie.set({
//         name: 'time',
//         value: obj,
//         expirationDate: 2147483647
//     })
// }

// function getCookie(name) {
//     const Cookie = session.defaultSession.cookies
//     return Cookie.get(name)
// }
export { sleep, isNumeric }
