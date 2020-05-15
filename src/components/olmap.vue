<template>
  <div id='box'>
    <vl-map id="stage" @movestart="mapChange" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" style="width:100%" @moveend="onMoveend">
      <vl-view :projection="projection" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>
      <vl-layer-image id="xkcd">
        <vl-source-image-static 
          :url="imgUrl" 
          :size="imgSize" 
          :extent="imgExtent" 
          :projection="projection"
        >
        </vl-source-image-static>
      </vl-layer-image>
      <template>
        <vl-overlay auto-pan v-for="(item, index) in dataSource" :key="index" :id="`overlay${index}`" :position="[item.x, item.y]">
            <Poptip trigger="hover" title="房间信息">
              <div slot="content" class="poptipExplain">
                <p>房间编号: {{item.roomNo?item.roomNo:'暂无'}}</p>
                <p>房间名称: {{item.roomName?item.roomName:'暂无'}}</p>
                <p>备注: {{item.extra?item.extra:'暂无'}}</p>
              </div>
                <img  @click="showModal(item.id)" :style="{backgroundColor: `${item.color}`, backgroundSize: '100% 100%', display:'block'}" :src="img" :width="item.imgW" :height="item.imgH">
            </Poptip>
        </vl-overlay>
      </template>
      <template>
        <Modal
          v-model="modal1"
          title="编辑房间信息"
          @on-cancel="cancel"
          cancel-text='取消'
        >
          <div slot="footer">
            <Button type="primary" @click="ok">保存</Button>
          </div>
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem  label="辐射分区:" prop="radiationZone">
                <ColorPicker @on-change="colorPickerChange" v-model="colorPicker" />
            </FormItem>
            <FormItem  label="房间编号:" prop="roomNo">
              <i-input type="text" v-model="formInline.roomNo" placeholder="请输入房间编号">
              </i-input>
            </FormItem>
            <FormItem  label="房间名称:" prop="roomName">
              <i-input type="text" v-model="formInline.roomName" placeholder="请输入房间名称">
              </i-input>
            </FormItem>
            <FormItem  label="备注:" prop="extra">
              <i-input type="text" v-model="formInline.extra" placeholder="请输入备注信息">
              </i-input>
            </FormItem>
        </Form>
        </Modal>
      </template>
    </vl-map>
    <Button style='position: fixed; bottom: 14px; right: 14px' type="primary">提交</Button>
  </div>
</template>

<script>
  // import VueLayers from 'vuelayers'
  import * as olExt from 'vuelayers/lib/ol-ext'
  import container from '../assets/外框.png'
  // import img from '../assets/room1.jpg'
  import img from '../assets/资源 3.svg'
  import dataSource from './dataSource'
  let size = [1024, 968]
  let extent = [0, 0, ...size]
  let customProj = olExt.createProj({
    code: 'xkcd-image',
    units: 'pixels',
    extent,
  })
  olExt.addProj(customProj)
  // document.getElementById('stage').onmousewheel=function() {return false}
  export default {
    name: 'Map',
    data () {
      return {
        img,
        dataSource,
        modal1: false,
        data: {},
        currentClickedRoomNo: 0,
        colorPicker: '',
        formInline: {
          radiationZone: '',
          roomNo: '',
          roomName: '',
          extra: ''
        },
        ruleInline: {
            radiationZone: [
              { required: true, message: '请选择辐射分区', trigger: 'blur' }
            ],
            roomNo: [
              { required: true, message: '请输入房间编号', trigger: 'blur' },
            ],
            roomName: [
              { required: true, message: '请输入房间名称', trigger: 'blur' },
            ]
        },
        currentZoom: 1,
        zoom: 1,
        maxZoom: 4,
        minZoom: 1,
        center: [size[0] / 2, size[1] / 2],
        rotation: 0,
        projection: customProj.getCode(),
        imgUrl: container,
        imgSize: size,
        imgExtent: extent,
        overlayCoordinate: [100, 770],
      }
    },
    mounted() {
      // this.clientWidth = document.body.clientWidth
      // this. clientHeight =  document.body.clientHeight
      const obj = JSON.parse(localStorage.getItem('type1'))
      if(obj) {
        this.data = obj
        const temp = this.dataSource.reduce((r, c) => {
          const { id, ...rest } = c
          return {
            ...r,
            [id]: {
              id,
              ...rest
            }
          }
        }, {})
        Object.keys(obj).forEach((c) => {
          temp[c].color = obj[c].radiationZone
          temp[c].roomNo = obj[c].roomNo
          temp[c].roomName = obj[c].roomName
          temp[c].extra = obj[c].extra
        })
        this.dataSource = Object.values(temp)
        // debugger
      }else {
        localStorage.setItem('type1', JSON.stringify({}))
      }
    },
    // created() {
    // },
    methods: {
      // handleScroll(e) {
      //   // console.log(e)
      //   // return false
      //   e.preventDefault()
      // },
      showModal(i) {
        this.modal1 = true
        this.currentClickedRoomNo = i
        const obj = JSON.parse(localStorage.getItem('type1'))
        if(obj[i]) {
          this.formInline = {
            radiationZone: obj[i].radiationZone,
            roomNo: obj[i].roomNo,
            roomName: obj[i].roomName,
            extra: obj[i].extra,
          }
        }else {
          this.$refs.formInline.resetFields();
        }
        this.formInline.radiationZone = ''
        const item = this.dataSource.reduce((r, c) => {
          return [
            ...r,
            ...(
              c.id == i? [c]: []
            )
          ]
        }, [])
        this.colorPicker = item[0].color
        this.formInline.radiationZone = item[0].color
      },
      colorPickerChange(hex) {
        this.formInline.radiationZone = hex;
        // this.dataSource[this.currentClickedRoomNo].color = hex
      },
      mapChange(e) {
        // console.log('hello world', e)
        //禁止鼠标滚轮缩放地图
        e.map.on('wheel', function () {
          return false
        })
      },
      onMoveend(e) {
        var zoom = e.map.getView().getZoom();
        if(this.currentZoom < zoom) {
          this.currentZoom = zoom;
          this.dataSource = this.dataSource.reduce((r, c) => {
            return [
              ...r,
              {
                x: c.x,
                y: c.y,
                id: c.id,
                radiationZone: c.radiationZone,
                roomNo: c.roomNo,
                roomName: c.roomName,
                extra: c.extra,
                divW: c.divW*2,
                divH: c.divH*2,
                imgW: c.imgW*2,
                imgH: c.imgH*2,
                color: c.color
              }
            ]
          }, [])
        }else if (this.currentZoom > zoom) {
          this.currentZoom = zoom;
          this.dataSource = this.dataSource.reduce((r, c) => {
            return [
              ...r,
              {
                x: c.x,
                y: c.y,
                id: c.id,
                radiationZone: c.radiationZone,
                roomNo: c.roomNo,
                roomName: c.roomName,
                extra: c.extra,
                divW: c.divW/2,
                divH: c.divH/2,
                imgW: c.imgW/2,
                imgH: c.imgH/2,
                color: c.color
              }
            ]
          }, [])
        }
      },
      ok() {
        if(this.formInline.roomNo === '' || this.formInline.roomName === '' || this.formInline.radiationZone==='') {
          this.$Message.info('请填写必填项!')
        }else {
          const obj = JSON.parse(localStorage.getItem('type1'))
          this.dataSource.forEach((item) => {
            if(item.id === this.currentClickedRoomNo) {
              item.color = this.formInline.radiationZone
            }
          })
          this.$Message.success('操作成功!');
          localStorage.setItem('type1', JSON.stringify({
            ...obj,
            [this.currentClickedRoomNo]: this.formInline
          }))
          const storage = JSON.parse(localStorage.getItem('type1'))
          const temp = this.dataSource.reduce((r, c) => {
            const { id, ...rest } = c
            return {
              ...r,
              [id]: {
                id,
                ...rest
              }
            }
          }, {})
          Object.keys(storage).forEach((c) => {
            temp[c].color = storage[c].radiationZone
            temp[c].roomNo = storage[c].roomNo
            temp[c].roomName = storage[c].roomName
            temp[c].extra = storage[c].extra
          })
          this.dataSource = Object.values(temp)
          this.modal1 = false
        }
      },
      cancel() {
        // this.$Message.info('Clicked cancel');
      },
    }
  }
</script>

<style >
.vl-map { height:100vh !important ;}
/*隐藏ol的一些自带元素*/
/* .ol-attribution,*/
.poptipExplain {
  /* width: 20px; */
  width: 150px;
  white-space: normal;
  word-break: break-all;
  line-height: 25px;
  font-size: 14px;
}
.ol-control button{
  width: 2.1em !important ;
  height: 2.1em !important ;
}
.btnGroup{
  margin-top: 20px;
  width: 400px;
  position: fixed;
  bottom: 10%;
  display: flex;
  justify-content: center;
}
#box {
  display: flex;
  justify-content: center;
}
</style>