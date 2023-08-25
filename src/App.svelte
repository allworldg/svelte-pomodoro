<script>
	import Panel from "./Panel.svelte";
	import { sleep, isNumeric } from "./utils.js";
	let seconds = 0;
	let tomatoes = "0";
	let rests = "0";
	let cycles = "0";
	$: minutes = Math.floor(seconds / 60);
	async function StartCountDown() {
		seconds = tomatoes * 60;
		while (seconds > 0) {
			seconds--;
			await sleep(1);
		}
	}
	function checkNumeric() {}
</script>

<main>
	<div>
		<Panel {minutes} {seconds} />
	</div>
	<div>
		<table>
			<tbody>
				<tr>
					<button on:click={StartCountDown}>开始/停止</button>
					<div>当前第x个/总共y个</div>
				</tr>
				<tr>
					<div style="display: inline">
						<span>番茄</span>
						<input
							bind:value={tomatoes}
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
							type="text"
							placeholder="x"
						/><span>分钟</span>
					</div>
					<div style="display: inline">
						<span>循环</span>
						<input
							bind:value={cycles}
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
