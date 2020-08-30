<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-card>
        <el-row>
          <el-button @click="newServer=(newServer?false:true)" style="float: left" :type="newServer?'':'primary'" plain>
            {{ newServer ? 'Cancel' : '+1' }}
          </el-button>
        </el-row>
      </el-card>
      <div v-if="newServer" class="row">
        <el-card>
          <code>install {{ apiaddress }} servername `curl ip.sb -4` `curl ip.sb` {{ token }}</code>
        </el-card>
      </div>
      <div v-else class="row">
        <el-card>
          <serverList :table-header="tableHeader" :table-data="tableData" :option="tableOption" v-loading="loading"/>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import serverList from '@/components/itemList'
import comm from "@/components/comm"
import config from "@/config";

export default {
  components: {
    mainLayout,
    serverList
  },
  data() {
    return {
      pageName: ["Server"],
      tableHeader: ["ipv4", "nickName", "uptime"],
      tableOption: {view: true},
      tableData: [],
      timer: null,
      loading: true,
      newServer: false,
      installCode: "",
      apiaddress: config.apiAddress,
      token: '',
      nick: '',
    }
  },
  mounted() {
    this.getServer();
    this.getToken();
    this.timer = setInterval(this.getServer, 3000);
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
  methods: {
    getToken: function () {
      this.$http.get(config.apiAddress + "/web/UserInfo/Token", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code == 200) {
          this.token = res.body.Info
        } else {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
          })
        }
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
    getServer: function () {
      this.$http.get(config.apiAddress + "/web/ServerInfo", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        var data = res.body
        this.tableData = []
        for (let i = 0; i < data.length; i++) {
          var status = JSON.parse(data[i].status)
          this.tableData.push({
            id: data[i].ID,
            ipv4: data[i].ipv4,
            ipv6: data[i].ipv6,
            nickName: data[i].hostname,
            load: status.Load.load1.toFixed(2) + " " + status.Load.load5.toFixed(2) + " " + status.Load.load15.toFixed(2),
            uptime: comm.timeSwitch(status.Uptime),
            active: status.BootTime + status.Uptime + 5 - Date.parse(Date()) / 1000 < 0 ? false : true
          })
        }
        this.loading = false;
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
  }
}
</script>

<style scoped>
</style>
