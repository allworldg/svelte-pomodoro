const STATUS = {
    TOMATO: 1,
    REST: 2,
}
const NOTIFICATION_TYPE = {
    ready_rest: { type: 0, message: "开始休息" },
    end: { type: 1, message: "结束" },
    ready_tomato: { type: 2, message: "开始专注" }
}
const TERMINATE = 1;
const RUNNING = 0;
let timer;
onmessage = (e) => {
    let data = e.data;
    timer = new Timer(parseInt(data.tomatoes), parseInt(data.rests), parseInt(data.cycles))
    isInit = false;
    timer.start();
}

class Timer {
    constructor(tomatoes, rests, cycles) {
        this.timeId = undefined;
        this.status = STATUS.TOMATO;
        this.tomatoes = tomatoes;
        this.rests = rests;
        this.cycles = cycles;
        this.target_time = undefined;
    }
    start() {
        let now = new Date();
        if (this.status == STATUS.TOMATO) {
            console.log("start tomatoes")
            now.setMinutes(now.getMinutes() + this.tomatoes);
        } else if (this.status == STATUS.REST) {
            now.setMinutes(now.getMinutes() + this.rests)
            console.log("start rest")
        }
        console.log(now.toLocaleString())
        this.target_time = now
        setTimeout(() => {
            this.main_process()
        }, 100);
    }
    getRemainTime() {
        let now = new Date();
        let remain_time = this.target_time - now;
        return remain_time;
    }
    main_process() {
        let remain_time = this.getRemainTime();
        if (remain_time <= 0) {
            this.stop();
            console.log("end time :" + new Date().toLocaleString())
            if (this.status == STATUS.TOMATO) {
                this.cycles--;
            }
            this.notification();

            if (this.status == STATUS.REST && this.cycles == 0) {
                self.postMessage({ "remain_seconds": 0, 'status': TERMINATE });
                return;
            }
            this.status = this.status == STATUS.TOMATO ? STATUS.REST : STATUS.TOMATO;
            this.start();
        } else {
            this.sendTime(remain_time / 1000);
            this.timeId = setTimeout(() => {
                this.main_process();
            }, 100);
        }
    }
    stop() {
        clearTimeout(this.timeId)
    }
    notification() {
        if (this.status == STATUS.TOMATO) {
            if (this.rests > 0) {
                self.postMessage(NOTIFICATION_TYPE.ready_rest)
            }
        } else {
            //rest
            if (this.cycles == 0) {
                self.postMessage(NOTIFICATION_TYPE.end)
            } else {
                self.postMessage(NOTIFICATION_TYPE.ready_tomato)
            }
        }
    }
    sendTime(remain_seconds) {
        postMessage({ "remain_seconds": remain_seconds, status: RUNNING })
    }
}
