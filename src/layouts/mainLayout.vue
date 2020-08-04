<template>
  <el-container>
    <el-header><pageHeader :page-info="router"/></el-header>
  </el-container>
</template>

<script>
import pageHeader from "@/components/pageHeader";

export default {
  name: 'mainLayout',
  props:{
    router:Array,
    username:String
  },
  components: {
    pageHeader
  }
}
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  text-align: center;
}
</style>