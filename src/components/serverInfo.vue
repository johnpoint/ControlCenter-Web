<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Overview" name="overview">
      <el-row class="row">
        <el-col :lg="12" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>IPv4</span>
            </div>
            <div class="text item">
              {{ info.ipv4 }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12" :xs="24" v-if="info.ipv6!=info.ipv4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>IPv6</span>
            </div>
            <div class="text item">
              {{ info.ipv6 }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-progress :percentage="100" :status="!info.active?'exception':'success'"></el-progress>
      <el-row class="row">
        <el-col :lg="6" v-for="i in Object.keys(info.status.Percent)" :key="i">
          <el-card class="box-card" shadow="hover">
            <el-progress type="circle" :percentage="parseInt(info.status.Percent[i])" :show-text="true"
                         :color="colors"></el-progress>
            <div class="text item">
              {{ i }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Network" name="Network">
      <el-row class="row">
        <el-col :lg="6" :xm="8" v-for="key in Object.keys(info.status.Network)" :key="key" class="networkCard">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ key }}</span>
            </div>
            <div class="text item">
              <el-row class="row">
                <el-popover
                    placement="right"
                    width="400"
                    trigger="hover">
                  <p v-for="addr in info.status.Network[key]['Addrs']" :key="addr" style="width: fit-content">{{
                      addr
                    }}</p>
                  <el-button slot="reference">IP ADDRESS</el-button>
                </el-popover>
              </el-row>
              <el-row>
                <el-col
                    v-if="((info.status.Network[key]['ByteRecv']-beforeinfo.status.Network[key]['ByteRecv']) / 1048576/3).toFixed(2)!=0"
                    :lg="12">
                  <i class="el-icon-upload2 network">{{
                      ((info.status.Network[key]['ByteRecv'] - beforeinfo.status.Network[key]['ByteRecv']) / 1048576 / 3).toFixed(2)
                    }}</i><label> MB/s</label>
                </el-col>
                <el-col
                    v-if="((info.status.Network[key]['ByteSent']-beforeinfo.status.Network[key]['ByteSent']) / 1048576/3).toFixed(2)!=0"
                    :lg="12">
                  <i class="el-icon-download network">{{
                      ((info.status.Network[key]['ByteSent'] - beforeinfo.status.Network[key]['ByteSent']) / 1048576 / 3).toFixed(2)
                    }}</i><label> MB/s</label>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Docker" name="Docker">
      <itemList :table-header="tableHeader" :table-data="this.info.status.DockerInfo" :option="tableOption"/>
    </el-tab-pane>
    <el-tab-pane label="Option" name="Option">
      <el-row>
        <el-col :span="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Option</span>
            </div>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import itemList from '@/components/itemList'

export default {
  name: "serverInfo",
  components: {
    itemList
  },
  props: {
    info: {
      default: [{active: true}]
    },
    beforeinfo: {
      default: [{active: true}]
    }
  },
  data() {
    return {
      activeName: 'overview',
      timer: null,
      colors: [
        {color: '#5cb87a', percentage: 60},
        {color: '#e6a23c', percentage: 70},
        {color: '#f56c6c', percentage: 80}
      ],
      tableHeader: ["ID", "Image", "Name", "State", "Port"],
      tableOption: {stop: true, start: true}
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  mounted() {
  }
}
</script>

<style scoped>
.box-card {
  width: 95%;
  height: 95%;
}

.text {
  font-size: 14px;
}

.networkCard {
  height: 255px;
}

.row {
  padding: 30px;
}

.network {
  font-size: x-large;
}
</style>