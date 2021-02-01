<template>
  <div>
    <el-main>
      <el-row>
        <p>Seesion UUID: {{ this.$route.params.uuid }}</p>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-input v-model="typeCommand"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="sendCommand">Send</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;" v-for="i in showData" v-bind:key="i.index">
        <el-input
            type="textarea"
            autosize
            :value="i">
        </el-input>
      </el-row>
    </el-main>


  </div>
</template>

<script>
export default {
  name: "terminal",
  data() {
    return {
      showData: [],
      typeCommand: "",
    }
  },
  methods: {
    sendCommand: function () {
      if (this.typeCommand !== "") {
        this.showData = this.showData.reverse()
        this.showData.push(this.typeCommand);
        this.typeCommand = ""
        this.showData = this.showData.reverse()
      }
    }
  }
}
</script>

<style scoped>

</style>