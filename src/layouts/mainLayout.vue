<template>
  <el-container>
    <topMenu :username="username"/>
    <el-header><pageHeader :page-info="router"/></el-header>
    <el-footer class="footer"><footerCopyright/></el-footer>
  </el-container>
</template>

<script>
import topMenu from '@/components/topMenu';
import footerCopyright from '@/components/footerCopyright';
import pageHeader from "@/components/pageHeader";

export default {
  name: 'mainLayout',
  props:{
    router:Array,
    username:String
  },
  components: {
    footerCopyright,
    topMenu,
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