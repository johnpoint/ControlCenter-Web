<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
      <el-row>
        <el-col :lg="8" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Name</span>
            </div>
            <div class="text item" v-if="confInfoEdit">
              {{ confInfo.name }}
            </div>
            <div v-else class="text item">
              <el-input v-model="confInfo.name"  :disabled="confInfoEdit"></el-input>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="8" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Type</span>
            </div>
            <div class="text item" v-if="confInfoEdit">
              {{ confInfo.type }}
            </div>
            <div v-else class="text item">
              <el-input v-model="confInfo.type"  :disabled="confInfoEdit"></el-input>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="8" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Path</span>
            </div>
            <div class="text item" v-if="confInfoEdit">
              {{ confInfo.path }}
            </div>
            <div v-else class="text item">
              <el-input v-model="confInfo.path"  :disabled="confInfoEdit"></el-input>
            </div>
          </el-card>
        </el-col>

      </el-row>
      <el-row>
        <el-col :lg="24" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Configuration Option</span>
            </div>
            <el-button @click="confInfoEdit=(confInfoEdit?false:true)">{{
                confInfoEdit ? "Edit" : "Cancal"
              }}
            </el-button>
            <el-button v-if="!confInfoEdit" @click="updateInfo" style="float: left">Update</el-button>
            <el-button type="danger" @click="dialogVisible = true" style="float: right">Delete</el-button>
            <el-dialog
                title="Dangerous operation"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
              <span>This operation is very dangerous, please confirm the operation you want to perform a second time</span>
              <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible=false">cancel</el-button>
    <el-button type="danger" @click="dialogVisible=false;delCer()">confirm</el-button>
  </span>
            </el-dialog>
          </el-card>
        </el-col>
        <el-col :lg="24" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Configuration Value</span>
            </div>
            <el-input
                class="textarea"
                type="textarea"
                :disabled="confInfoEdit"
                :autosize="{ minRows: 2, maxRows: 40}"
                placeholder="value"
                v-model="confInfo.value">
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
import router from "@/router";

export default {
  components: {
    mainLayout,
  },
  data() {
    return {
      pageName: ["Certificate", this.$route.params.id],
      confInfo: {},
      confValue: '',
      privateKey: '',
      confInfoEdit: true,
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
    delCer: function () {
      this.$http.delete(config.apiAddress + "/web/Configuration/" + this.$route.params.id, {
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
          router.push("/Certificate")
        }
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    },
    updateTime: function () {
      this.time = new Date().format("yyyy-MM-dd hh:mm:ss");
    },
    getInfo: function () {
      this.$http.get(config.apiAddress + "/web/Configuration?id=" + this.$route.params.id, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        var data = res.body
        for (let i = 0; i < data.length; i++) {
          this.confInfo = {
            id: data[i].ID,
            name: data[i].name,
            path: data[i].path,
            type: data[i].type,
            value: data[i].value,
          }
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
      this.$http.post(config.apiAddress + "/web/Certificate", this.confInfo, {
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
