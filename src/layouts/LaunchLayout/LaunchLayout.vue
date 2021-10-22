<template>
  <div class="launch_layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "LaunchLayout",
  created() {
    document.body.classList.add("launch_layout_body");
  }
}
</script>

<style src="./LaunchLayout.scss" lang="scss"/>
