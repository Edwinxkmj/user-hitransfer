<template>
  <el-card style="cursor: pointer">
    <img class="border-top" style="width: 386px;height: 250px" v-lazy="place.img">
    <!-- <img class="border-top" style="width: 386px;height: 250px" v-else src="@/assets/images/place.png"> -->
    <div class="place">
      <h3 class="title">{{place.title}}</h3>
      <div class="flex-between location-number">
        <div class="location">
           <i class="el-icon-location-information"></i>
          {{place.country}}，{{place.city}}
        </div>
        <div class="number">
          {{place.num}}{{$t('order.sold')}}
        </div>
      </div>

      <div class="flex-between price-star">
        <span class="price color-green">
          <span v-if="lang == 'en'">from</span>
            {{place.price}}
            {{$t('m.pp')}}
          </span>
        <el-rate 
          style="position: relative;left: 10px;"
          v-model="place.score"
          :colors="['#F9BD4F','#F9BD4F','#F9BD4F']"
          disabled>
        </el-rate>
      </div>
    </div>
  </el-card>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    name: "PlaceCard",
    props: {
      place: {
        type: Object,
        default(){
          return {};
        },
        required: true,
      }
    },
    computed: {
      ...mapState({
        lang: state => state.lang
      })
    },
  }
</script>

<style scoped lang="scss">
  /deep/{
    .el-card{
      border-radius: 12px;
      box-shadow: none;
      border: 0;
      width: 386px;
      height: 250px;
      border: 1px red solid;
    }
    .el-card__body{
      padding: 0;
    }

    .el-col{
      margin-bottom: 30px;
    }
  }

  .el-card.is-always-shadow {
    -webkit-box-shadow:none;
    box-shadow: none;
  }

  .border-top {
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
  }

  .place{
    position: relative;
    top: -2px;
    padding: 5px 24px;
    background: #FAFAFA;
    width: 338px;
    height: 129px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;

    .title{
      height: 35px;
      font-size:20px;
      font-weight:500;
      color:#333;
      line-height:30px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .location-number{
      font-size:14px;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:20px;
      margin: 10px 0;

      .location{
        position: relative;

        &:before{
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }

    .price-star{
      position: relative;
      left: 2px;
      padding-bottom: 14px;

      .price{
        font-size: 16px;
        font-weight: 500;
      }
    }

  }
</style>
