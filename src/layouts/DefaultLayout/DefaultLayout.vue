<template>
  <div class="default_layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  created() {
    document.body.classList.add("default_layout_body");
  }
}
</script>

<style src="./DefaultLayout.scss" lang="scss"/>