<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
      <serverInfo :info="info" :beforeinfo="beforeinfo" :certificate-data="certificateData"
                  :certificate-on-server="certificateOnServer" :certificateData="certificateData"
                  :configurationData="configurationData"
                  :taskTableData="taskTableData"
                  v-if="info && beforeinfo"/>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverInfo from '@/components/serverInfo'
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
      taskTableData: [],
      configurationData: [],
    }
  },
  created() {
    this.getInfo();
    this.getInfo();
    this.timer = setInterval(this.getInfo, 3000)
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
  methods: {
    getInfo: function () {
      this.$socket.send("serverStatus#" + this.$route.params.id);
      this.requestLock = true;
      this.$socket.onmessage = (data) => {
        data = JSON.parse(data.data.replace("serverStatus", ""))
        let server = data.Server
        this.beforeinfo = this.info
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
      delete this.$socket.onmessage;
    },
  }
}
</script>

<style scoped>
</style>
