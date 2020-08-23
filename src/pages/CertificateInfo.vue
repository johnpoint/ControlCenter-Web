<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
      <el-card>{{ time }}</el-card>
      <el-row>
        <el-col :lg="4" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Domain</span>
            </div>
            <div class="text item">
              {{ cerInfo.domain }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="8" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Subject</span>
            </div>
            <div class="text item">
              {{ cerInfo.Subject }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="8" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Issuer</span>
            </div>
            <div class="text item">
              {{ cerInfo.Issuer }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Status</span>
            </div>
            <div class="text item">
              {{  cerInfo.active?"OK":"Warning" }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Issued On</span>
            </div>
            <div class="text item">
              {{ cerInfo.Issued }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Expires On</span>
            </div>
            <div class="text item">
              {{ cerInfo.Expires }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-progress :percentage="cerInfo.percent"
                   :status="cerInfo.active?'success':'warning'"></el-progress>
      <el-row>
        <el-col :lg="24" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Certificate Option</span>
            </div>
            <el-button @click="cerInfoEdit=(cerInfoEdit?false:true)">{{
                cerInfoEdit ? "Edit" : "Cancal"
              }}
            </el-button>
            <el-button v-if="!cerInfoEdit" @click="updateInfo" style="float: left">Update</el-button>
            <el-button type="danger" @click="dialogVisible = true" style="float: right">Delete</el-button>
            <el-dialog
                title="Dangerous operation"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
              <span>This operation is very dangerous, please confirm the operation you want to perform a second time</span>
              <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">cancel</el-button>
    <el-button type="danger" @click="dialogVisible = false">confirm</el-button>
  </span>
            </el-dialog>
          </el-card>
        </el-col>
        <el-col :lg="12" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Certificate Fullchain</span>
            </div>
            <el-input
                class="textarea"
                type="textarea"
                :disabled="cerInfoEdit"
                :autosize="{ minRows: 2, maxRows: 20}"
                placeholder="fullchain"
                v-model="Fullchain">
            </el-input>
          </el-card>
        </el-col>
        <el-col :lg="12" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Certificate Fullchain</span>
            </div>
            <el-input
                class="textarea"
                type="textarea"
                :disabled="cerInfoEdit"
                :autosize="{ minRows: 2, maxRows: 20}"
                placeholder="privateKey"
                v-model="privateKey">
            </el-input>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import config from "@/config";

export default {
  components: {
    mainLayout,
  },
  data() {
    return {
      pageName: ["Certificate", this.$route.params.id],
      cerInfo: {},
      Fullchain: '',
      privateKey: '',
      cerInfoEdit: true,
      fullscreenLoading: true,
      timer: null,
      time: '',
    }
  },
  mounted() {
    this.getInfo();
    this.timer = setInterval(this.updateTime, 500)
  },
  beforeRouteUpdate(to, from, next) {
    window.clearInterval(this.timer)
    next()
  },
  methods: {
    updateTime: function () {
      this.time = new Date().format("yyyy-MM-dd hh:mm:ss");
    },
    getInfo: function () {
      this.$http.get(config.apiAddress + "/web/Certificate?id=" + this.$route.params.id, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        var data = res.body
        for (let i = 0; i < data.length; i++) {
          var nn = Date.parse(new Date()) / 1000, na = data[i].NotAfter, nb = data[i].NotBefore;
          this.cerInfo = {
            id: data[i].id,
            name: data[i].name,
            domain: data[i].DNSNames,
            Issuer: data[i].Issuer,
            Subject: data[i].Subject,
            Expires: new Date(data[i].NotAfter * 1000).format("yyyy-MM-dd hh:mm:ss"),
            Issued: new Date(data[i].NotBefore * 1000).format("yyyy-MM-dd hh:mm:ss"),
            percent: parseInt((nn - nb) / (na - nb) * 100),
            active: parseInt((nn - nb) / (na - nb) * 100) >= 80 ? false : true,
            isExpires: parseInt((nn - nb) / (na - nb) * 100) >= 100 ? true : false
          }
          this.privateKey = data[i].key;
          this.Fullchain = data[i].fullchain
        }
        this.fullscreenLoading = false;
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    },
    updateInfo: function () {
      this.$http.post(config.apiAddress + "/web/Certificate", {
        id: parseInt(this.$route.params.id),
        fullchain: this.Fullchain,
        key: this.privateKey
      }, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code != 200) {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
          })
        } else {
          this.$notify({
            title: 'Update Success',
            message: res.body.Info,
            type: 'success'
          })
          this.cerInfoEdit = true;
          this.getInfo()
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
.card {
  height: 200px !important;
}

.col {
  padding: 5px;
}

.item {
  padding: 15px;
}

.textarea {
  margin: auto;
  width: 97%;
}
</style>
