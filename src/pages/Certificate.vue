<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <serverList :table-header="tableHeader" :table-data="tableData"/>
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
      tableHeader: ["domain", "Issued", "Expires", "Issuer"],
      tableData: [{
        id: 29,
        domain: 'lvcshu.com',
        Issued: '2019-08-27 21:58:55',
        Expires: '2020-08-27 21:58:55',
        Issuer: 'CN=AlphaSSL CA - SHA256 - G2,O=GlobalSign nv-sa,C=BE'
      }]
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
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
