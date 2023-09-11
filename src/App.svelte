<script>
	import Panel from "./Panel.svelte";
	import { isValid, setCookie, getCookie } from "./utils.js";
	import { onMount } from "svelte";
	let tomatoes = "1";
	let rests = "0";
	let cycles = "1";
	let minutes = 0;
	let seconds = 0;
	let isStarted = 1;
	let myWorker;
	$: btn_name = isStarted == 1 ? "开始" : "停止";

	function startOrStop() {
		if (isStarted == 1) {
			myWorker = new Worker("./worker.js");
			isStarted = 0;
		} else {
			isStarted = 1;
			myWorker.terminate();
		}
	}

	async function checkAndSave() {
		if (
			!isValid(tomatoes, 1, 240) ||
			!isValid(rests, 0, 240) ||
			!isValid(cycles, 1, 100)
		) {
			console.log("number not valid");
			let obj = await getCookie();
			if (obj.length == 0) {
				tomatoes = "1";
				rests = "0";
				cycles = "1";
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
