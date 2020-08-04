<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <serverList/>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverList from '@/components/itemList'

export default {
  components: {
    mainLayout,
    serverList
  },
  data() {
    return {
      pageName: ["Certificate", this.$route.params.id]
    }
  }
}
</script>

<style scoped>

</style>
