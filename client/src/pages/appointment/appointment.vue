<template>
  <div class="appointment">
    <appointment-box></appointment-box>
    <!-- <div class="map-container"> -->
      <!-- <GmapMap :center="{lng:116.389, lat:39.9303}" :zoom="12" map-type-id="roadmap" style="width: 100%; height: 680px"></GmapMap> -->
    <!-- </div> -->

    <div ref="mapBox" id="allmap" style="position: absolute;top: 0;width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
  import AppointmentBox from './suspendBox';

  export default {
    name: "appointment",
    components: { AppointmentBox },
    data() {
      return {}
    },
    methods: {},
    mounted(){
      /*设置导航高亮*/
      this.$store.commit('SET_ACTIVE_PATH',this.$route.path);

      // let map = getMyAddress(this.$refs.mapBox);

      // var driving = new BMap.DrivingRoute(map, {
      //   renderOptions: {
      //     map: map,
      //     autoViewport: true
      //   }
      // });
      // let searchComplete = (results)=>{
      //   if (transit.getStatus() !== BMAP_STATUS_SUCCESS){
      //     return ;
      //   }
      //   let plan = results.getPlan(0);
      //   console.log("时间:"+plan.getDuration(true));
      //   console.log("总路程为:"+plan.getDistance(true))
      // };
      // var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
      //   onSearchComplete: searchComplete,
      //   /*成功以后的回调方法*/
      //   onPolylinesSet: ()=>{

      //   }});

      // driving.search("都江堰宁江大院", "成都太升南路");
    }
  }
</script>

<style scoped lang="scss">
  .appointment{
    height: 94vh;
    background: url('../../assets/images/appointment.jpg') no-repeat;
    background-size: cover;
    position: relative;
  }

  .map-container {
    width: 100%;
    height: 680px;
  }
</style>
