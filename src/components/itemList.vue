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
            v-if="option.start"
            size="mini"
            @click="handleStart(scope.$index, scope.row)">Start
        </el-button>
        <el-button
            v-if="option.stop"
            size="mini"
            type="danger"
            @click="handleStop(scope.$index, scope.row)">Stop
        </el-button>
        <el-button
            v-if="option.add"
            size="mini"
            @click="handleAdd(scope.$index, scope.row)">Add
        </el-button>
        <el-button
            v-if="option.remove"
            size="mini"
            type="danger"
            @click="handleRemove(scope.$index, scope.row)">Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

import router from "@/router";

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
    handleAdd: function () {

    },
    handleRemove: function () {

    }
  },
  props: {
    tableHeader: {
      default: []
    },
    tableData: {
      default: []
    },
    option: {
      default: {view: true, stop: false, start: false, add: false, remove: false, color: true}
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
