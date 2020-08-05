<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
      <serverInfo :info="info" :beforeinfo="beforeinfo" :certificate-data="certificateData"
                  :certificate-on-server="certificateOnServer"/>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverInfo from '@/components/serverInfo'
import config from "@/config";
import comm from '@/components/comm'

export default {
  components: {
    mainLayout,
    serverInfo
  },
  data() {
    return {
      pageName: ["Server", this.$route.params.id],
      timer: null,
      info: null,
      beforeinfo: null,
      fullscreenLoading: true,
      certificateData: [],
      certificateOnServer: [],
    }
  },
  created() {
    this.getServerInfo();
    this.getServerInfo();
    this.getCerList();
    this.timer = setInterval(this.getServerInfo, 3000)
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
  methods: {
    getServerInfo: function () {
      this.$http.get(config.apiAddress + "/web/ServerInfo?id=" + this.$route.params.id, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        },
      }).then(function (res) {
        var data = res.body
        this.tableData = []
        for (let i = 0; i < data.length; i++) {
          var status = JSON.parse(data[i].status)
          this.beforeinfo = this.info
          this.info = {
            id: data[i].ID,
            ipv4: data[i].ipv4,
            ipv6: data[i].ipv6,
            nickName: data[i].hostname,
            load: status.Load.load1.toFixed(2) + " | " + status.Load.load5.toFixed(2) + " | " + status.Load.load15.toFixed(2),
            uptime: comm.timeSwitch(status.Uptime),
            active: status.BootTime + status.Uptime + 5 - Date.parse(Date()) / 1000 < 0 ? false : true,
            status: status,
          }
        }
        this.fullscreenLoading = false
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    },
    getCerList: function () {
      this.$http.get(config.apiAddress + '/web/Certificate', {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        },
      }).then(function (res) {
        console.log(res.body)
        let data = res.body;
        this.certificateData = []
        for (let i = 0; i < data.length; i++) {
          this.certificateData.push({
            id: data[i].id,
            domain: data[i].DNSNames,
            Issuer: data[i].Issuer,
            Expires: new Date(data[i].NotAfter * 1000).getFullYear() + "-" + new Date(data[i].NotAfter * 1000).getMonth() + "-" + new Date(data[i].NotAfter * 1000).getDate(),
            Issued: new Date(data[i].NotBefore * 1000).getFullYear() + "-" + new Date(data[i].NotBefore * 1000).getMonth() + "-" + new Date(data[i].NotBefore * 1000).getDate(),
            active: parseInt(((Date.parse(new Date()) / 1000 - data[i].NotBefore / (data[i].NotAfter - data[i].NotBefore)) * 100)) >= 80 ? false : true
          })
        }
        this.$http.get(config.apiAddress + '/web/ServerInfo/Certificate?id=' + this.$route.params.id, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          let data = res.body;
          data.forEach(item => {
            this.certificateOnServer.push(item.CertificateID)
          })
        }, function (res) {
          this.$notify({
            title: 'Server Warning',
            message: res.status,
            type: 'warning'
          })
        })
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
