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
        <confList :table-header="tableHeader" :table-data="tableData" :option="tableOption" v-loading="loading"/>
      </div>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '@/layouts/mainLayout'
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
      tableData: [],
      loading: true,
    }
  },
  beforeMount() {
    this.getConf()
  },
  methods: {
    getConf: function () {
      this.$store.state.ws.send("get@ConfigurationList");
      this.$store.state.ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        this.tableData = []
        data.forEach(item => {
          let i = {
            id: item.ID,
            Type: item.Type,
            Name: item.Name,
            Path: item.Path
          }
          this.tableData.push(i)
        })
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
</style>
