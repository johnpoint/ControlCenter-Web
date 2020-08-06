<template>
  <div>
    <mainLayout :router="pageName"></mainLayout>
  </div>
</template>

<script>
import mainLayout from "@/layouts/mainLayout";

export default {
  name: "Settings",
  components: {
    mainLayout,
  },
  data() {
    return {
      pageName: ['Settings']
    }
  }
}
</script>

<style scoped>

</style>