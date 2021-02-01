<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <serverList :table-header="tableHeader" :table-data="tableData" :option="tableOption" v-loading="loading"/>
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
      requestLock: false,
    }
  },
  mounted() {
    this.getServer();
    this.timer = setInterval(this.getServer, 3000);
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
  methods: {
    getServer: function () {
      if (this.requestLock !== true) {
        this.$store.state.ws.send("serverList");
        this.requestLock = true;
        this.$store.state.ws.onmessage = (data) => {
          data = JSON.parse(data.data)
          this.tableData = []
          for (let i = 0; i < data.length; i++) {
            const status = JSON.parse(data[i].status);
            this.tableData.push({
              id: data[i].ID,
              ipv4: data[i].ipv4,
              ipv6: data[i].ipv6,
              nickName: data[i].hostname,
              load: status.Load.load1.toFixed(2) + " " + status.Load.load5.toFixed(2) + " " + status.Load.load15.toFixed(2),
              uptime: comm.timeSwitch(status.Uptime),
              active: status.BootTime + status.Uptime + 5 - Date.parse(Date()) / 1000 >= 0
            })
          }
          this.loading = false;
          this.requestLock = false;
        }
        delete this.$store.state.ws.onmessage;
      }
    },
  }
}
</script>

<style scoped>
</style>
