<script>
  export let minutes;
  export let seconds;
  export let runningTitle = "";
  $: formattedMinutes = minutes >= 10 ? minutes : "" + 0 + minutes;
  $: formattedSeconds = seconds >= 10 ? seconds : "" + 0 + seconds;
</script>

<main>
  <div style="text-align: center;font-size:20px">{runningTitle}</div>
  <div><span style="font-size: 30px">{formattedMinutes} : {formattedSeconds}</span></div>
</main>
