改用vue+vite+electron重写了。 [vue-pomodoro](https://github.com/allworldg/vue-pomodoro)
# 极简番茄
番茄钟app已经数不胜数了，但是它们不是太复杂，就是不太满足我自己的需求，所以我又造了个番茄钟的轮子，顺便入门学习一下electron。

## 技术栈
Electron+Svelte。Svelte基础语法糖比较简单，上手很容易。

![show.png](https://github.com/allworldg/tomato/blob/master/show.png)

## 功能
1. 自定义单个番茄时长、休息间隔时长、以及循环次数。同时可以自定义音乐提醒。
2. 消息提醒：番茄和休息结束前10s有提示声，同时在番茄和休息结束时有系统通知。
3. 使用worker来创建新线程倒计时，稍微比简单的settimeout更加精准（settimeout受到浏览器限制，后台倒计时可能会长时间卡死，导致不能按时结束）
4. 在点击开始后，点击关闭自动最小化到托盘。
