<template>
  <div>
    <div class="notfounddiv"><h1>404 | Not Found</h1><label class="subtitle" @click="goHome">Back to the right way</label></div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  components: {
  },
  data() {
    return {
      pageName: "404 Page"
    }
  },
  methods: {
    goHome: function () {
      router.push({path: '/'})
    }
  }
}
</script>
<style scoped>
.notfounddiv {
  color: #303133;
  text-align: center;
  position: absolute;
  top: 40%;
  width: 100%;
}
.subtitle{
  color: #909399;
}
</style>