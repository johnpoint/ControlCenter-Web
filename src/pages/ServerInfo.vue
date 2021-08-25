<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
      <serverInfo :info="info" :beforeinfo="beforeinfo" :certificate-data="certificateData"
                  :certificate-on-server="certificateOnServer" :certificateData="certificateData"
                  :configurationData="configurationData"
                  :taskTableData="taskTableData" :psData="psData"
                  v-if="info && beforeinfo"/>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverInfo from '@/components/serverInfo'
import comm from '@/components/comm'
import config from "@/config";

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
      taskTableData: [],
      configurationData: [],
      psData: []
    }
  },
  created() {
    this.getInfo();
    this.getCerList();
    this.getInfo();
    this.timer = setInterval(this.getInfo, 3000)
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
  methods: {
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
    },
    getInfo: function () {
      this.$store.state.ws.send("get@serverStatus#" + this.$route.params.id);
      this.requestLock = true;
      this.$store.state.ws.onmessage = (data) => {
        data = JSON.parse(data.data.replace("serverStatus", ""))
        let server = data.Server
        this.beforeinfo = this.info
        let ps = server.Ps.split('\n')
        this.psData = [];
        ps.forEach(item => {
          if (item.split(" ").length > 3) {
            item = item.split(" ")
            if (item[0] === "") {
              item = item.slice(1, item.length)
            }
            let i = {
              PID: item[0],
              User: item[1],
              State: item[2],
              Pcpu: item[3],
              Pmem: item[4],
              Command: item.slice(5, item.length).toString().replaceAll(",", " "),
            }
            this.psData.push(i)
          }
        })
        let status = JSON.parse(server.status)
        this.info = {
          id: server.ID,
          ipv4: server.ipv4,
          ipv6: server.ipv6,
          nickName: server.hostname,
          load: status.Load.load1.toFixed(2) + " | " + status.Load.load5.toFixed(2) + " | " + status.Load.load15.toFixed(2),
          uptime: comm.timeSwitch(status.Uptime),
          active: status.BootTime + status.Uptime + 5 - Date.parse(Date()) / 1000 >= 0,
          status: status,
        }
        this.taskTableData = [];
        data.Tasks.forEach(item => {
          this.taskTableData.push({
            ID: item.ID,
            Type: item.Type !== 1 ? 'Docker' : 'Client',
            TargetID: item.TargetID,
            Code: item.Code,
            Info: item.Info,
            Active: item.Active === 1 ? "队列中" : "未激活",
          })
        })
        this.configurationData = []
        data.Configuration.forEach(item => {
          let i = {
            ID: item.ID,
            Name: item.Name,
            Path: item.Path,
            Type: item.Type,
            onServer: item.Enable
          }
          this.configurationData.push(i)
        })
        this.certificateData = []
        data.Certificate.forEach(item => {
          let i = {
            id: item.ID,
            domain: item.DNSNames,
            Issuer: item.Issuer,
            Expires: new Date(item.NotAfter * 1000).getFullYear() + "-" + new Date(item.NotAfter * 1000).getMonth() + "-" + new Date(item.NotAfter * 1000).getDate(),
            Issued: new Date(item.NotBefore * 1000).getFullYear() + "-" + new Date(item.NotBefore * 1000).getMonth() + "-" + new Date(item.NotBefore * 1000).getDate(),
            active: parseInt(((Date.parse(new Date()) / 1000 - item.NotBefore / (item.NotAfter - item.NotBefore)) * 100)) < 80,
            onServer: this.certificateOnServer.indexOf(item.ID) !== -1
          }
          this.certificateData.push(i)
        })
        this.loading = false;
        this.requestLock = false;
        this.fullscreenLoading = false
      }
      delete this.$store.state.ws.onmessage;
    },
  }
}
</script>

<style scoped>
</style>
