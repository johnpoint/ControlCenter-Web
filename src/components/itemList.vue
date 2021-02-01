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
            :type="(tableData[scope.$index].State === 'running') ? 'danger' : 'primary'"
            @click="handleDocker(scope.$index)" plain>
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
            :type="(tableData[scope.$index].Level < 1) ? 'danger':'primary'"
            @click="handleAdmin(scope.$index)" plain>{{
            !(tableData[scope.$index].Level >= 1) ? 'Cancel administrator rights' : 'Set asadministrator'
          }}
        </el-button>
        <el-button
            v-if="option.configuration"
            size="mini"
            :type="(tableData[scope.$index].onServer) ? 'danger':'primary'"
            @click="handleConfiguration(scope.$index)" plain>{{ (tableData[scope.$index].onServer) ? 'Remove' : 'Add' }}
        </el-button>
        <el-button
            v-if="option.configuration"
            size="mini"
            @click="handleConfigurationView(scope.$index,scope.row)"
            plain>View
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import router from "@/router";
import config from "@/config";

export default {
  mounted() {
    this.tableDataCopy = this.tableData
  },
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
    handleConfiguration: function (index) {
      if (this.tableData[index].onServer) {
        this.$http.delete(config.apiAddress + "/web/link/Configuration/" + this.$route.params.id + "/" + this.tableData[index].ID, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (res.body.Code === 200) {
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
        this.$http.put(config.apiAddress + "/web/link/Configuration/" + this.$route.params.id + "/" + this.tableData[index].ID, {}, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (res.body.Code === 200) {
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
      return index
    },
    handleConfigurationView: function (index, row) {
      router.push("/Configuration/" + row.ID)
      return index
    },
    handleDocker: function (index) {
      let dockerChange = 6200;
      if (this.tableData[index].State === "running") {
        dockerChange = 6202
      } else {
        dockerChange = 6201
      }
      this.$http.post(config.apiAddress + "/web/Server/" + this.$route.params.id + "/Docker/" + dockerChange + "/" + this.tableData[index].ID, {}, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code === 200) {
          this.$notify({
            title: 'Success',
            type: 'success'
          });
        } else {
          this.$notify({
            title: 'Error',
            type: 'error',
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
    },
    handleAdmin: function (index) {
      console.log(this.tableData[index]);
      let targetLevel = 0;
      if (this.tableData[index].Level >= 1) {
        targetLevel = -1;
      } else {
        targetLevel = 1;
      }
      this.$http.patch(config.apiAddress + "/web/UserInfo/level/" + this.tableData[index].ID + "/" + targetLevel, {}, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code === 200) {
          this.$notify({
            title: 'Success',
            type: 'success'
          });
        } else {
          this.$notify({
            title: 'Error',
            type: 'error',
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
    },
    handleCertificate: function (index) {
      if (this.tableData[index].onServer) {
        this.$http.delete(config.apiAddress + "/web/link/Certificate/" + this.$route.params.id + "/" + this.tableData[index].id, {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (res.body.Code === 200) {
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
          if (res.body.Code === 200) {
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
    return {
      tableDataCopy: [],
    }
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
