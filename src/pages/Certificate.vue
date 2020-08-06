<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <serverList :table-header="tableHeader" :table-data="tableData" v-loading="loading"/>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverList from '@/components/itemList'
import config from "@/config";

export default {
  components: {
    mainLayout,
    serverList
  },
  data() {
    return {
      pageName: ["Certificate"],
      tableHeader: ["domain", "Issued", "Expires"],
      tableData: [],
      loading: true,
    }
  },
  mounted() {
    this.getCertificate();
  },
  methods: {
    getCertificate: function () {
      this.$http.get(config.apiAddress + "/web/Certificate", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        var data = res.body
        this.tableData = []
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            id: data[i].id,
            domain: data[i].DNSNames,
            Issuer: data[i].Issuer,
            Expires: new Date(data[i].NotAfter * 1000).getFullYear() + "-" + new Date(data[i].NotAfter * 1000).getMonth() + "-" + new Date(data[i].NotAfter * 1000).getDate(),
            Issued: new Date(data[i].NotBefore * 1000).getFullYear() + "-" + new Date(data[i].NotBefore * 1000).getMonth() + "-" + new Date(data[i].NotBefore * 1000).getDate(),
            active: parseInt(((Date.parse(new Date()) / 1000 - data[i].NotBefore / (data[i].NotAfter - data[i].NotBefore)) * 100)) >= 80 ? false : true
          })
        }
        this.loading = false
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
