const STATUS = {
    STOP: 0,
    TOMATO: 1,
    REST: 2,
}
console.log("work is init")
let isInit = true;
let timer;
onmessage = (e) => {
    let data = e.data;
    if (isInit) {
        timer = new Timer(data.tomato, data.rest, data.cycles)
        isInit = false;
    }
    if (data.status == 0) {
        timer.start();
    } else {
        timer.stop();
        self.close();
    }

}

class Timer {
    constructor(tomato, rest, cycles) {
        this.timeId = undefined;
        this.status = undefined;
        this.tomato = tomato;
        this.rest = rest;
        this.cycles = cycles;
        this.cur_cycle = undefined;
        this.target_time = undefined;
    }
    start() {
        let now = new Date();
        if (this.status == 0) {
            now.setMinutes(now.getMinutes() + this.tomato);
            this.status = 1;
        } else if (this.status == 1) {
            now.setMinutes(now.getMilliseconds + this.rest)
            this.status = 2;
        }
        this.target_time = now
        setTimeout(() => {
            this.main_process()
        }, 10);
    }
    getRemainTime() {
        let now = new Date();
        let remain_time = now - target_time;
        return remain_time;
    }
    main_process() {
        let remain_time = this.getRemainTime();
        if (remain_time <= 0) {
            this.stop();
            if (this.status == 1) {
                this.cycles--;
            }
            this.notification();
            if (this.status == 2 && this.cycles == 0) {
                this.postMessage({ 'data': {}, 'status': 1});
                return;
            }
            this.status = 0;
            this.start();
        } else {
            this.sendTime(remain_time);
            timeId = setTimeout(() => {
                this.main_process();
            }, 100);
        }
    }
    stop() {
        clearTimeout(this.timeId)
    }
    notification() {
    }
    sendTime(remain_time) {
        postMessage(remain_time)
    }
}
