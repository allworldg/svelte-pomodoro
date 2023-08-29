<script>
	import Panel from "./Panel.svelte";
	import { sleep, isValid, setCookie, getCookie } from "./utils.js";
	import { onMount } from "svelte";
	let seconds = 0;
	let tomatoes = "0";
	let rests = "0";
	let cycles = "0";
	let isStarted = 0;
	$: btn_name = isStarted == 0 ? "开始" : "停止";
	$: minutes = Math.floor(seconds / 60);
	async function StartCountDown() {
		seconds = tomatoes * 60;
		while (seconds > 0) {
			seconds--;
			await sleep(1);
		}
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
					<button on:click={StartCountDown}>{btn_name}</button>
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
