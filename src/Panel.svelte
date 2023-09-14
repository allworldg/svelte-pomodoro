<script>
  export let minutes;
  export let seconds;
  export let runningTitle = "";
  $: formattedMinutes = minutes >= 10 ? minutes : "" + 0 + minutes;
  $: formattedSeconds = seconds >= 10 ? seconds : "" + 0 + seconds;
</script>

<main>
  <div>{runningTitle}</div>
  <div><span>{formattedMinutes} : {formattedSeconds}</span></div>
</main>
