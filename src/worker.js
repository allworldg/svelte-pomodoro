let target_time;
let timeId;
let time;
function countDown() {
    let now = new Date().getTime();
    let remain_seconds = (target_time - now) / 1000;
    if (remain_seconds <= 0) {
        postMessage("terminate")
    } else {
        postMessage(remain_seconds)
    }
    timeId = setTimeout(() => {
        countDown();
    }, 1000);

}
onmessage = (message) => {
    time = message.data;
    target_time = new Date();
    console.log(target_time.toLocaleString())
    target_time.setMinutes(target_time.getMinutes() + time);
    setTimeout(() => {
        countDown()
    }, 10);
}
