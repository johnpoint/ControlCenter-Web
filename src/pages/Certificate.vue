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
        <cerList :table-header="tableHeader" :table-data="tableData" v-loading="loading"/>
      </div>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import cerList from '@/components/itemList'
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
      this.$store.state.ws.send("get@CertificateList")
      this.$store.state.ws.onmessage = (event) => {
        let data = JSON.parse(event.data)
        this.tableData = []
        data.forEach(item => {
          let i = {
            id: item.ID,
            domain: item.DNSNames,
            Issuer: item.Issuer,
            Expires: new Date(item.NotAfter * 1000).format("yyyy-MM-dd hh:mm:ss"),
            Issued: new Date(item.NotBefore * 1000).format("yyyy-MM-dd hh:mm:ss"),
            active: parseInt(((Date.parse(new Date()) / 1000 - item.NotBefore / (item.NotAfter - item.NotBefore)) * 100)) < 80
          }
          this.tableData.push(i)
        })
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
