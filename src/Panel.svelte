<script>
  export let minutes;
  export let seconds;
  $: formattedMinutes = `${minutes >= 10 ? minutes : "" + 0 + minutes}`;
  $: formattedSeconds = `${
    seconds % 60 >= 10 ? seconds % 60 : "" + 0 + (seconds % 60)
  }`;
</script>

<main>
  <div><span>{formattedMinutes} : {formattedSeconds}</span></div>
</main>
