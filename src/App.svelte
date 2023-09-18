<script>
	import Panel from "./Panel.svelte";
	import {
		isValid,
		setCookie,
		getCookie,
		notification,
		sendIsStarted,
	} from "./utils.js";
	import { onMount } from "svelte";
	let tomatoes = "1";
	let rests = "0";
	let cycles = "1";
	let minutes = 0;
	let seconds = 0;
	let isStarted = 1;
	let myWorker;
	let runningTitle = "";
	let audio = new Audio();
	let audio_paths = [];
	let audio_path = "";
	let audio_name = "";
	const RUNNING = 0;
	const TERMINATE = 1;
	const NOTIFICATION = 2;
	const RUNNING_STATUS = {
		TOMATO: 1,
		REST: 2,
	};
	$: btn_name = isStarted == 1 ? "开始" : "停止";

	function startOrStop() {
		if (isStarted == 1) {
			isStarted = 0;
			sendIsStarted(isStarted);
			myWorker = new Worker("./worker.js");
			myWorker.postMessage({
				tomatoes,
				rests,
				cycles,
				status: 0,
			});
			myWorker.onmessage = (e) => {
				if (e.data.isPlayed != undefined) {
					if (e.data.isPlayed) {
						audio = new Audio("./resource/forest.mp4"); //之后写一个路径检查，防止音乐文件不存在
						audio.onerror = function () {
							notification(
								"音乐文件播放失败，检查路径以及文件是否损坏。"
							);
						};
						audio.play();
					} else {
						audio.pause();
						audio.currentTime = 0;
					}
				}
				if (e.data.status == TERMINATE) {
					isStarted = 1;
					sendIsStarted(isStarted);
					minutes = 0;
					seconds = 0;
					myWorker.terminate();
					audio.pause();
					audio.currentTime = 0;
					runningTitle = "";
				} else if (e.data.status == RUNNING) {
					let remain_seconds = e.data.remain_seconds;
					if (e.data.running_status == RUNNING_STATUS.TOMATO) {
						runningTitle = "正在专注";
					} else if (e.data.running_status == RUNNING_STATUS.REST) {
						runningTitle = "正在休息";
					}
					minutes = Math.floor(remain_seconds / 60);
					seconds = Math.floor(remain_seconds % 60);
				} else if (e.data.status == NOTIFICATION) {
					notification(e.data.notification.message);
				}
			};
		} else {
			isStarted = 1;
			sendIsStarted(isStarted);
			myWorker.terminate();
			minutes = 0;
			seconds = 0;
			runningTitle = "";
			audio.pause();
			audio.currentTime = 0;
		}
	}

	async function checkAndSave() {
		if (
			!isValid(tomatoes, 1, 240) ||
			!isValid(rests, 0, 240) ||
			!isValid(cycles, 1, 100)
		) {
			let obj = await getCookie();
			if (obj.length == 0) {
				tomatoes = "1";
				rests = "0";
				cycles = "1";
				setCookie({
					tomatoes,
					rests,
					cycles,
					audio_paths: [],
					audio_path: "",
				});
			} else {
				obj = JSON.parse(obj[0].value);
				tomatoes = obj.tomatoes;
				cycles = obj.cycles;
				rests = obj.rests;
				audio_paths = obj.audio_paths;
				audio_path = obj.audio_path;
			}
		} else {
			tomatoes = parseInt(tomatoes).toString();
			rests = parseInt(rests).toString();
			cycles = parseInt(cycles).toString();
			setCookie({ tomatoes, rests, cycles });
		}
	}
	onMount(async () => {
		let obj = await getCookie();
		obj = JSON.parse(obj[0].value);
		tomatoes = obj.tomatoes;
		rests = obj.rests;
		cycles = obj.cycles;
	});
</script>

<main>
	<div>
		<Panel {minutes} {seconds} {runningTitle} />
	</div>
	<div style="display: flex">
		<table>
			<tbody>
				<tr>
					<button on:click={startOrStop}>{btn_name}</button>
					<div>当前第x个/总共y个</div>
				</tr>
				<tr>
					<div style="display: inline;flex:auto">
						<span>番茄</span>
						<input
							bind:value={tomatoes}
							on:change={checkAndSave}
							type="text"
							min="0"
							max="10"
							placeholder="x"
						/><span>分钟;</span>
					</div>
					<div style="display: inline; flex:auto">
						<span>休息</span>
						<input
							bind:value={rests}
							on:change={checkAndSave}
							type="text"
							placeholder="x"
						/><span>分钟</span>
					</div>
					<div style="display: inline; flex:auto">
						<span>循环</span>
						<input
							bind:value={cycles}
							on:change={checkAndSave}
							type="text"
							placeholder="x"
						/><span>次</span>
					</div>
				</tr>
				<tr>
					<select bind:value={audio}>
						<option />
					</select>
					<div><a href="#">点击选择提示音</a></div>
					<div><a>清除自定义音乐</a></div>
				</tr>
			</tbody>
		</table>
	</div>
</main>
