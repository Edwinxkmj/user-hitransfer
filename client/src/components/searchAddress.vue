<template>
    <div id="searchAddress">
        <el-input class="input" @focus="clearValue" v-model="inputAddress" :clearable="true" :title="inputAddress" :placeholder="placeholder" @input="querySearchAsync" clear></el-input>
        <div class="address-list" v-if="inputAddress && restaurants.length > 0 && isShow"> 
          <p v-for="(item, index) in restaurants" :key="index" @click="selectAddress(item.address)">{{item.address}}</p>  
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { googleMap, baiduMap, getGoogleImg} from '../assets/js/public';
  export default {
    name: 'searchAddress',
    props: {
        address: String,
        placeholder: String,
        airportCity: String,
        aIndex: Number
    },
    data () {
      return {
          isUseGoogle: false,
          inputAddress: this.address == 1? '' : this.address || '',
          isShow: false,
          restaurants: []
      }
    },
    computed: {
      ...mapState({
          lang: state => state.lang
      }),
    },
    created() {
        document.addEventListener('click', (e) => {
            let destinationBox = document.getElementById('searchAddress');
            destinationBox && destinationBox.contains(e.target) ? this.isShow = true : this.isShow = false;
        })
    },
    methods: {
        clearValue() {
            this.restaurants.length = 0;
        },
        querySearchAsync(queryString) {
            this.isShow = true; 
            getGoogleImg().then((res) => {
                this.isUseGoogle = res;
                let _this = this;
                if (queryString) {
                if (this.isUseGoogle) {
                    googleMap(_this.airportCity+queryString).then((res) => {
                    _this.restaurants = res;
                    });
                }else {
                    baiduMap(queryString, _this.airportCity, this.$axios.jsonp).then((res) => {
                        _this.restaurants = res;
                    });
                    }
                }
            })
        },
        selectAddress(address) {
            this.inputAddress = address;
            this.isShow = false;
        }
    },
    watch: {
        inputAddress() {
            this.$emit('inputAddress', this.inputAddress); 
            this.$emit('addressIndex', this.aIndex); 
        
        }
    }
  }  
</script>

<style scoped lang="scss">
#searchAddress {
    position: relative;
    .input {
        position: relative;
        z-index: 1;
    }
}
.address-list {
    position: absolute;
    z-index: 20;
    width: auto !important;
    min-width: 440px !important;
    height: auto;
    transform-origin: center top;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #FFF;
    margin-top: 2px;
    padding: 20px;
   
    p {
        margin: 0;
        padding: 0;
        text-align: left;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        cursor: pointer;
        width: auto !important;
        min-width: 240px !important;
        color: #606266;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
}

</style>