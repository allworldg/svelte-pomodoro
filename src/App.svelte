<script>
	import Panel from "./Panel.svelte";
</script>

<main>
	<div>
		<Panel />
	</div>
	<div>
		<table>
			<tbody>
				<tr>
					<button>开始/停止</button>
					<div>当前第x个/总共y个</div>
				</tr>
				<tr>
					<div>
						<span>番茄</span>
						<input type="text" placeholder="x" /><span>分钟</span>
					</div>
					<div>
						<span>休息</span>
						<input type="text" placeholder="x" /><span>分钟</span>
					</div>
					<div>
						<span>循环</span>
						<input type="text" placeholder="x" /><span>分钟</span>
					</div>
				</tr>
				<tr>
					<div><a href="#">点击选择提示音</a></div>

				</tr>
			</tbody>
		</table>
	</div>
</main>
