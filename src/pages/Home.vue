<template>
  <div class="home">
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-row>
        <el-col v-for="card in cards" :key="card.index" :lg="6">
          <div @click="goTo(card.title)">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{ card.title }}</span>
              </div>
              <div class="text item">
                {{ card.num }}
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '../layouts/mainLayout.vue'
import router from "@/router";
import config from "@/config";

export default {
  components: {
    mainLayout
  },
  data() {
    return {
      cards: [
        {title: "Server", num: 0},
        {title: "Certificate", num: 0}
      ],
      pageName: ["Home"]
    }
  },
  mounted() {
    this.getServerNum();
    this.getCerNum();
  },
  methods: {
    goTo: function (target) {
      router.push("/" + target)
    },
    getServerNum: function () {
      this.$http.get(config.apiAddress + "/web/ServerInfo", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        this.cards[0].num = res.body.length
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    },
    getCerNum: function () {
      this.$http.get(config.apiAddress + "/web/Certificate", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        this.cards[1].num = res.body.length
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
.home {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  top: 0px;
}

.box-card {
  width: 95%;
}

.text.item {
  font-size: 60px;
  text-align: center;
}
</style>
