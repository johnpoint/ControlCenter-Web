<template>
  <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
    <el-table-column
        v-for="item in tableHeader"
        :prop="item"
        :label="item"
        v-bind:key="item.index">
    </el-table-column>
    <el-table-column label="option">
      <template slot-scope="scope">
        <el-button
            v-if="option.view"
            size="mini"
            @click="handleView(scope.$index, scope.row)">View
        </el-button>
        <el-button
            v-if="option.docker"
            size="mini"
            :type="(tableData[scope.$index].State == 'running') ? 'danger' : 'primary'"
            @click="handleStop(scope.$index, scope.row)" plain>
          {{ (tableData[scope.$index].State == 'running') ? 'Stop' : 'Start' }}
        </el-button>
        <el-button
            v-if="option.certificate"
            size="mini"
            :type="(tableData[scope.$index].onServer) ? 'danger':'primary'"
            @click="handleCertificate(scope.$index)" plain>{{ (tableData[scope.$index].onServer) ? 'Remove' : 'Add' }}
        </el-button>
        <el-button
            v-if="option.admin"
            size="mini"
            :type="(tableData[scope.$index].Level != 0) ? 'primary':'danger'"
            @click="setAsAdministrator(scope.$index, scope.row)" plain>{{
            (tableData[scope.$index].Level != 0) ? 'Set asadministrator' : 'Cancel administrator rights'
          }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import router from "@/router";
import config from "@/config";

export default {
  methods: {
    tableRowClassName({rowIndex}) {
      if (this.option.color == false) {
        return '';
      }
      if (this.tableData[rowIndex].active == undefined) {
        return '';
      }
      if (this.tableData[rowIndex].active) {
        return 'success-row';
      } else {
        return 'warning-row';
      }
    },
    handleView: function (index, row) {
      router.push(this.$route.path + "/" + row.id)
    },
    handleStop: function () {

    },
    handleStart: function () {

    },
    handleCertificate: function (index) {
      if (this.tableData[index].onServer) {
        this.$http.delete(config.apiAddress + "/web/link/Certificate/" + this.$route.params.id + "/" + this.tableData[index].id, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (res.body.Code == 200) {
            this.$notify({
              title: 'Success',
              type: 'success'
            });
          } else {
            this.$notify({
              title: 'Error',
              type: 'success',
              message: res.body.Info
            });
          }
        }, function (res) {
          this.$notify({
            title: 'Server Warning',
            message: res.status,
            type: 'warning'
          })
        })
      } else {
        this.$http.put(config.apiAddress + "/web/link/Certificate/" + this.$route.params.id + "/" + this.tableData[index].id, {}, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (res.body.Code == 200) {
            this.$notify({
              title: 'Success',
              type: 'success'
            });
          } else {
            this.$notify({
              title: 'Error',
              type: 'success',
              message: res.body.Info
            });
          }
        }, function (res) {
          this.$notify({
            title: 'Server Warning',
            message: res.status,
            type: 'warning'
          })
        })
      }

    },
  },
  props: {
    tableHeader: {
      default: []
    },
    tableData: {
      default: []
    },
    option: {
      default: {view: true, docker: false, certificate: false, color: false, admin: false}
    },
  },
  data() {
    return {}
  }
}
</script>

<style>
.el-table .warning-row {
  background: #f56c6c61;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
