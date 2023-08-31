<script>
  export let minutes;
  export let seconds;
  $: formattedMinutes = `${minutes >= 10 ? minutes : "" + 0 + minutes}`;
  $: formattedSeconds = `${seconds >= 10 ? seconds : "" + 0 + seconds}`;
</script>

<main>
  <div><span>{formattedMinutes} : {formattedSeconds}</span></div>
</main>
