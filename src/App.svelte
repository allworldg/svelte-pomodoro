<script>
	import Panel from "./Panel.svelte";
	import { isValid, setCookie, getCookie } from "./utils.js";
	import { onMount } from "svelte";
	let tomatoes = "0";
	let rests = "0";
	let cycles = "0";
	let endTime;
	let minutes = 0;
	let seconds = 0;
	let isStarted = 1;
	let timeId;
	let interval = 1000;
	let expected_time;
	$: btn_name = isStarted == 1 ? "开始" : "停止";
	function startOrStop() {
		if (isStarted == 0) {
			//stop
			isStarted = 1;
			timeId = clearTimeout(timeId);
			minutes = 0;
			seconds = 0;
		} else {
			//start
			isStarted = 0;
			let now_time = new Date();
			console.log(now_time.toLocaleString());
			expected_time = now_time.getTime() + interval;
			now_time.setMinutes(now_time.getMinutes() + parseInt(tomatoes));
			endTime = now_time.getTime();
			setTimeout(() => {
				countDown();
			}, 100);
		}
	}

	function countDown() {
		let now = new Date().getTime();
		let remain_seconds = (endTime - now) / 1000;
		if (remain_seconds <= 0) {
			timeId = clearTimeout(timeId);
			minutes = 0;
			seconds = 0;
			isStarted = 1;
			console.log(new Date().toLocaleString());
			return;
		}
		seconds = parseInt((remain_seconds % 60) + "");
		minutes = parseInt(remain_seconds / 60 + "");
		timeId = setTimeout(() => {
			countDown();
		}, 100);
	}

	async function checkAndSave() {
		if (!isValid(tomatoes) || !isValid(rests) || !isValid(cycles)) {
			console.log("number not valid");
			let obj = await getCookie();
			if (obj.length == 0) {
				tomatoes = "0";
				rests = "0";
				cycles = "0";
				setCookie({ tomatoes, rests, cycles });
			} else {
				obj = JSON.parse(obj[0].value);
				tomatoes = obj.tomatoes;
				cycles = obj.cycles;
				rests = obj.rests;
			}
		} else {
			console.log("number all valid");
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
		<Panel {minutes} {seconds} />
	</div>
	<div>
		<table>
			<tbody>
				<tr>
					<button on:click={startOrStop}>{btn_name}</button>
					<div>当前第x个/总共y个</div>
				</tr>
				<tr>
					<div style="display: inline">
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
					<div style="display: inline">
						<span>休息</span>
						<input
							bind:value={rests}
							on:change={checkAndSave}
							type="text"
							placeholder="x"
						/><span>分钟</span>
					</div>
					<div style="display: inline">
						<span>循环</span>
						<input
							bind:value={cycles}
							on:change={checkAndSave}
							type="text"
							placeholder="x"
						/><span>分钟</span>
					</div>
				</tr>
				<tr>
					<div><a href="#">点击选择提示音</a></div>
				</tr>
			</tbody>
		</table>
	</div>
</main>
