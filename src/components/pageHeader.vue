<template>
  <el-row>
    <el-col :span="24" class="pageheader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">ContorlCenter</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in pageInfo" :key="item">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    </el-col>
  </el-row>

</template>

<script>
export default {
  name: "pageHeader",
  props: {
    pageInfo: Array
  },
  methods: {
    goBack() {
      window.location.back()
    }
  }
}
</script>

<style scoped>
.pageheader{
  padding: 24px;
}
</style>