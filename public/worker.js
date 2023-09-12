const STATUS = {
    STOP: 0,
    TOMATO: 1,
    REST: 2,
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
        this.status = STATUS.STOP;
        this.tomatoes = tomatoes;
        this.rests = rests;
        this.cycles = cycles;
        this.cur_cycle = undefined;
        this.target_time = undefined;
    }
    start() {
        let now = new Date();
        console.log(now.toLocaleString())
        if (this.status == STATUS.STOP) {
            now.setMinutes(now.getMinutes() + this.tomatoes);
            this.status = STATUS.TOMATO;
        } else if (this.status == STATUS.TOMATO) {
            now.setMinutes(now.getMilliseconds + this.rests)
            this.status = STATUS.REST;
        }
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
            if (this.status == STATUS.TOMATO) {
                this.cycles--;
            }
            this.notification();
            if (this.status == STATUS.REST && this.cycles == 0) {
                console.log("terminate : " + new Date().toLocaleString())
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
    }
    sendTime(remain_seconds) {
        postMessage({ "remain_seconds": remain_seconds, status: RUNNING })
    }
}
