<template>
  <div>
    <topMenu v-if="$route.path!='/Login'"/>
    <div id="app" class="main">
      <router-view/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
<script>
import topMenu from '@/components/topMenu'

export default {
  components: {
    topMenu
  }
}
</script>
