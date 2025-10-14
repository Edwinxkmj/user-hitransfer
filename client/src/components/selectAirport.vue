<template>
    <div id="selectAirport" >
        <el-input placeholder="Airport" value="aname" v-model="airportName" @input="searchInput" @focus="isShow = true" :clearable='true'></el-input>
        <div class="box" v-if="isShow" v-loading="isLoading">
            <div v-if="searchAirportArr.length == 0">
                <div class="title">
                    <span class="fz15 color-333" :class="{'active': active == index}" v-for="(item,index) in airport" :key="index" @click="selectContinent(index)"> {{item.name}}</span>
                </div>
                <div>
                    <p v-for="(item,index) in continent.city" :key="index">
                        <section class="flex-between" v-for="(item2,index2) in item.airport" :key="index2" @click="selectAirportFn(item2.name, item2.id, item.name)">
                            <label class="fz14 color-666">{{item.name}}</label> <span class="fz14 color-333 text-right airport-name">{{item2.name}}</span>
                        </section>
                    </p>
                </div>
            </div>
            <div v-else>
                 <div>
                    <p v-for="(item,index) in searchAirportArr" :key="index">
                        <section class="flex-between" v-for="(item2,index2) in item.airport" :key="index2" @click="selectAirportFn(item2.name, item2.id, item.name)">
                            <label class="fz14 color-666">{{item.name}}</label> <span class="fz14 color-333 text-right airport-name">{{item2.name}}</span>
                        </section>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    name: 'selectAirport',
    props: {
        aname: String
    },
    data () {
      return {
          airport: [],
          continent: [],
          active: 0,
          isShow: false,
          airportName: this.aname || '',
          isLoading: true,
          searchAirportArr: []
      }
    },
    computed: {
      ...mapState({
          lang: state => state.lang
      }),
    },
    created() {
        document.addEventListener('click', (e) => {
            let destinationBox = document.getElementById('selectAirport');
            destinationBox && destinationBox.contains(e.target) ? this.isShow = true : this.isShow = false;
        })
    },
    mounted(){
      this.getAirport();
    },
    methods: {
        searchInput() {
            let searchArr = [], _this = this;
            if (!_this.airportName) {
                 this.searchAirportArr.length = 0;
                 return;
            }
            this.airport.map((item, index) => {
                item.city.map((item2, index2) => {
                    item2.airport.map((item3, index3) => {
                        if (item3.name.indexOf(_this.airportName.toUpperCase()) != -1) {
                            searchArr.push(item2);
                        }
                    })
                })
            })

            this.searchAirportArr = this.fn(searchArr);
        },
        fn(arr){
            if(!Array.isArray(arr)){
                return;
            }
            return [...new Set(arr)]
        },
        getAirport() {
            this.$axios.get("en/tools/airport").then((res => {
                this.airport = res.data.data;
                this.isLoading = false;
                this.selectContinent(0);
            }))
        },
        selectContinent(index) {
            this.active = index;
            this.continent = this.airport[index];
        },
        selectAirportFn(name, id, cityName) {
            this.airportName = name;
            this.isShow = false;
            this.$emit('airportId', id);
            this.$emit('airportName', name);
            this.$emit('cityName', cityName);
        }
    }
  }
</script>
<style scoped lang="scss">
    #selectAirport {
        width: 100%;
        position: relative;
    }
    .box {
        position: absolute;
        width: 100%;
        background: #fff;
        z-index: 10;
        height: 349px;
        overflow: auto;
        border-top: 4px solid #38846A;
        box-shadow: 1px 4px 7px -2px rgba(51,51,51,0.5);
        border-radius: 0px 0px 12px 12px;
        padding: 0;
        min-width: 520px;
        .airport-name {
            vertical-align: middle;
            padding: 0;
        }
        .title {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            border-bottom: 1px solid #F9F9F9;
            padding: 5px 0;
            .active {
                border-bottom: 2px solid #38846A;
                color: #38846A;
                cursor: pointer;
            }
            span {
                font-size: 16px;
                color: #333;
                margin: 0 15px;
                text-align: left;
                height: 30px;
                line-height: 30px;
                font-weight: 600;
                cursor: pointer;
            }
        }
        section,p {
            margin: 0;
            padding: 0;
        }
        section {
            padding: 0 10px;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
        }
        section:hover {
            background: rgba(49,159,94,0.2);
        }
    }

    .box::-webkit-scrollbar{
        width:4px;
        height:4px;
    }
    .box::-webkit-scrollbar-track{
        background: 2px solid #f1ecde;
        border-radius:8px;
    }
    .box::-webkit-scrollbar-track-piece{/*内层轨道，滚动条中间部分（位置4）*/
        border-radius: 2px 2px 0px 0px;
    }
    .box::-webkit-scrollbar-thumb{
        background: #ccc;
        border-radius:6px;
    }
    .box::-webkit-scrollbar-thumb:hover{
        background: #ccc;
    }
    .box::-webkit-scrollbar-corner{
        background: #f6f6f6;
    }

    .box {
        overflow-y: scroll;
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;
    }

</style>


