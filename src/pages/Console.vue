<template>
  <div>
    <mainLayout :router="pageName"></mainLayout>
    <div v-if="!isAdmin" class="notfounddiv"><h1>403 | Forbidden</h1><label class="subtitle" @click="goHome">Back to the
      right
      way</label></div>
    <div v-else>
      <el-card class="row">
        <el-tabs v-model="activeName">
          <el-tab-pane label="System Info" name="info" v-loading="Loading" style="min-height: 300px">
            <el-row v-if="info" class="row">
              <el-col :lg="6" v-for="i in Object.keys(info.Percent)" :key="i">
                <el-card class="box-card" shadow="hover">
                  <el-progress type="circle" :percentage="parseInt(info.Percent[i])" :show-text="true"
                               :color="colors"></el-progress>
                  <div class="text item">
                    {{ i }}
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="User" name="user">
            <el-card>
              <el-button @click="getUserList" type="primary" plain style="float: left"><i
                  class="el-icon-refresh-right"></i></el-button>
              <itemList :table-header="userTableHeader" :table-data="userTableData" :option="{admin:true}"></itemList>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Backup" name="backup">
            <el-row class="row">
              <el-col :lg="12">
                <el-card>
                  Download Backup
                </el-card>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :lg="12">
                <el-card>
                  <div slot="header" class="clearfix">
                    <span>Upload Backup</span>
                  </div>
                  <uploadDatabase></uploadDatabase>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="System Log" name="log">Log</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import mainLayout from "@/layouts/mainLayout";
import itemList from "@/components/itemList";
import uploadDatabase from "@/components/uploadDatabase";
import config from "@/config";

export default {
  components: {
    mainLayout,
    itemList,
    uploadDatabase
  },
  data() {
    return {
      pageName: ["System Console"],
      isAdmin: false,
      activeName: 'info',
      userTableHeader: ["ID", "email", "name", "Level"],
      userTableData: null,
      info: null,
      colors: [
        {color: '#5cb87a', percentage: 60},
        {color: '#e6a23c', percentage: 70},
        {color: '#f56c6c', percentage: 80}
      ],
      Timer: null,
      Loading: true,
    }
  },
  methods: {
    goHome: function () {
      router.push({path: '/'})
    },
    getUserList: function () {
      this.$notify({
        title: 'Loading',
        type: 'info'
      })
      this.$http.get(config.apiAddress + "/web/UserInfo/", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        console.log(res.body)
        this.userTableData = res.body
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    },
    getSystemInfo: function () {
      this.$http.get(config.apiAddress + "/system/info").then(function (res) {
        this.info = JSON.parse(res.body.Info)
        this.Loading = false
      })
    }
  },
  mounted() {
    this.isAdmin = (this.$store.state.userInfo.level == 0) ? true : false
    this.Timer = setInterval(this.getSystemInfo, 5000)
    this.getUserList();
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.Timer);
    next();
  }
}
</script>
<style scoped>
.notfounddiv {
  color: #303133;
  text-align: center;
  position: absolute;
  top: 40%;
  width: 100%;
}

.subtitle {
  color: #909399;
}

.box-card {
  width: 95%;
  height: 95%;
}
</style>