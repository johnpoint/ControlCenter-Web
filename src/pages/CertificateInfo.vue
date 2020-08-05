<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
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
        <el-col :lg="4" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Subject</span>
            </div>
            <div class="text item">
              {{ cerInfo.Subject }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4" :sm="8" class="col">
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
              <span>Issued On</span>
            </div>
            <div class="text item">
              {{ cerInfo.Issued }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Expires On</span>
            </div>
            <div class="text item">
              {{ cerInfo.Expires }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4" :sm="8" class="col">
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>Status</span>
            </div>
            <div class="text item">
              {{ ((!cerInfo.active ? 'Warning' : 'OK') == 'warning' && cerInfo.isExpires) ? 'Expires' : 'Warning' }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-progress :percentage="cerInfo.percent"
                   :status="((!cerInfo.active?'warning':'success')=='warning' && cerInfo.isExpires)?'exception':'warning'"></el-progress>
      <el-row>
        <el-col :lg="12" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Certificate Info</span>
            </div>
            <el-button @click="editfullchain = true">Fullchain</el-button>
            <el-button @click="editkey = true">privateKey</el-button>
          </el-card>
        </el-col>
        <el-col :lg="12" class="col">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Certificate Option</span>
            </div>
            <el-button type="danger" @click="dialogVisible = true">Delete</el-button>
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
      </el-row>
      <el-drawer
          :visible.sync="editfullchain"
          direction="rtl"
          size="65%">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Fullchain</span>
          </div>
          <el-input
              class="textarea"
              type="textarea"
              :disabled="FullchainEdit"
              :autosize="{ minRows: 2, maxRows: 20}"
              placeholder="fullchain"
              v-model="Fullchain">
          </el-input>
        </el-card>
        <el-card>
          <el-button>Copy</el-button>
          <el-button @click="FullchainEdit=(FullchainEdit?false:true)">{{
              FullchainEdit ? "Edit" : "Cancal"
            }}
          </el-button>
          <el-button v-if="!FullchainEdit">Update</el-button>
        </el-card>
      </el-drawer>
      <el-drawer
          :visible.sync="editkey"
          direction="rtl"
          size="65%">
        <el-card>
          <div slot="header" class="clearfix">
            <span>privateKey</span>
          </div>
          <el-input
              class="textarea"
              type="textarea"
              :disabled="privateKeyEdit"
              :autosize="{ minRows: 2, maxRows: 20}"
              placeholder="privateKey"
              v-model="privateKey">
          </el-input>
        </el-card>
        <el-card>
          <el-button>Copy</el-button>
          <el-button @click="privateKeyEdit=(privateKeyEdit?false:true)">{{
              privateKeyEdit ? "Edit" : "Cancal"
            }}
          </el-button>
          <el-button v-if="!privateKeyEdit" @click="centerDialogVisible=true">Update</el-button>
        </el-card>
      </el-drawer>
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
      FullchainEdit: true,
      privateKey: '',
      privateKeyEdit: true,
      editfullchain: false,
      editkey: false,
      dialogVisible: false,
      fullscreenLoading: true,
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
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
            domain: data[i].DNSNames,
            Issuer: data[i].Issuer,
            Subject: data[i].Subject,
            Expires: new Date(data[i].NotAfter * 1000).getFullYear() + "-" + (new Date(data[i].NotAfter * 1000).getMonth() + 1) + "-" + new Date(data[i].NotAfter * 1000).getDate(),
            Issued: new Date(data[i].NotBefore * 1000).getFullYear() + "-" + (new Date(data[i].NotBefore * 1000).getMonth() + 1) + "-" + new Date(data[i].NotBefore * 1000).getDate(),
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
