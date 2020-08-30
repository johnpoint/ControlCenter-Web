<template>
  <div class="server">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-card>
        <el-row>
          <el-button @click="newConf=(newConf?false:true)" style="float: left" :type="newConf?'':'primary'" plain>
            {{ newConf ? 'Cancel' : '+1' }}
          </el-button>
        </el-row>
      </el-card>
          <newConfiguration v-if="newConf" class="row"/>
      <div v-else class="row">
        <el-card>
          <confList :table-header="tableHeader" :table-data="tableData" :option="tableOption" v-loading="loading"/>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
import config from "@/config";
import confList from '@/components/itemList'
import newConfiguration from "@/components/newConfiguration";

export default {
  components: {
    mainLayout,
    confList,
    newConfiguration
  },
  data() {
    return {
      pageName: ["Configuration"],
      tableOption: {view: true},
      tableHeader: ["id", "Type", "Name", "Path"],
      newConf: false,
      tableData: null,
      loading: true,
    }
  },
  beforeMount() {
    this.getConf()
  },
  methods: {
    getConf: function () {
      this.$http.get(config.apiAddress + "/web/Configuration", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        var data = res.body
        this.tableData = []
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            id: data[i].ID,
            Type: data[i].type,
            Name: data[i].name,
            Path: data[i].path
          })
        }
        this.loading = false
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
