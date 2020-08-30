<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-card>
        <el-row>
          <el-button @click="newCert=(newCert?false:true)" style="float: left" :type="newCert?'':'primary'" plain>
            {{ newCert ? 'Cancel' : '+1' }}
          </el-button>
        </el-row>
      </el-card>
      <newCertificate v-if="newCert" class="row"/>
      <div v-else class="row">
        <el-card>
          <cerList :table-header="tableHeader" :table-data="tableData" v-loading="loading"/>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import cerList from '@/components/itemList'
import config from "@/config";
import newCertificate from "@/components/newCertificate";

export default {
  components: {
    mainLayout,
    cerList,
    newCertificate
  },
  data() {
    return {
      pageName: ["Certificate"],
      tableHeader: ["domain", "Issued", "Expires"],
      tableData: [],
      loading: true,
      newCert: false,
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
            Expires: new Date(data[i].NotAfter * 1000).format("yyyy-MM-dd hh:mm:ss"),
            Issued: new Date(data[i].NotBefore * 1000).format("yyyy-MM-dd hh:mm:ss"),
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
