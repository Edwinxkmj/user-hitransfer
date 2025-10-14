<template>
  <div id="getAirplane">
    <div class="divCenter flex">
      <airplay-box></airplay-box>
      <div class="text">
          <div class="bigTitle">{{$t('p.air-trip')}}</div>
          <div class="smallTitle mt40">
            <img src="../../assets/images/checked.png"/>
            <span>{{$t('p.air-trip1')}}</span>
          </div>
          <div class="smallTitle">
            <img src="../../assets/images/checked.png"/>
            <span>{{$t('p.air-trip2')}}</span>
          </div>
          <div class="smallTitle">
            <img src="../../assets/images/checked.png"/>
            <span>{{$t('p.air-trip3')}}</span>
          </div>
          <div class="smallTitle" v-if="lang == 'zh'">
            <img src="../../assets/images/checked.png"/>
            <span>{{$t('p.air-trip4')}}</span>
          </div>
      </div>
     
    </div>
  </div>
</template>

<script>
  import AirplayBox from './airplayBox';
  import { mapState } from 'vuex';
  export default {
    name: 'getAirplane',
    components: { AirplayBox },
    data () {
      return {

      }
    },
    computed: {
      ...mapState({
          lang: state => state.lang
      }),
    },
    mounted(){
      this.$store.commit('SET_ACTIVE_PATH',this.$route.path);
    },
    methods: {
    }
  }
</script>

<style scoped>
  #getAirplane{
    background: url("../../assets/images/airportbg.jpg") no-repeat center center;
    background-size: cover;
    height: 94vh;
    overflow: hidden;
  }

  #getAirplane .divCenter{
    width: 1260px;
    height: 100%;
    margin: auto;
    position: relative;
    top: 50px;
  }

  #getAirplane .text {
    margin-top: 200px;
    margin-left: 10px;
  }

  #getAirplane .divCenter .bigTitle{
    font-weight: normal;
    height: 56px;
    line-height:56px;
    font-size:40px;
    color:rgba(255,255,255,1);
    margin-left: 35px;
  }

  #getAirplane .divCenter .smallTitle{
    height: 30px;
    font-size: 0;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height: 30px;
    margin-top: 14px;
    margin-left: 30px;
  }

  #getAirplane .divCenter .smallTitle img{
    vertical-align: middle;
    margin-left: 10px;
  }

  #getAirplane .divCenter .smallTitle span{
    font-size: 22px;
    vertical-align: middle;
    margin-left: 20px;
  }



</style>
