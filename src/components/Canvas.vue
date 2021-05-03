<template>
  <canvas ref="can" />
</template>

<script>
import { fabric } from 'fabric'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'

export default {
  data () {
    return {
      canvas: {},
      allFlags: {},
      eyes: {},
      accessories: {},
      flag: {},
      eye: {}
    }
  },
  mounted() {
    const ref = this.$refs.can
    this.canvas = new fabric.Canvas(ref)
    this.fitToContainer(this.canvas)
    this.$nextTick(() => {
      window.addEventListener('resize', () => this.fitToContainer(this.canvas))
      this.canvas.on('selection:created', (objects) => {
        this.$store.commit('setSelected', { active: true, objects })
      })
      this.canvas.on('selection:cleared', () => {
        this.$store.commit('setSelected', { active: false })
      })
    })
    this.initFlag()
    this.initStroke()
    this.initEye()
  },
  created() {
    this.loadFlags()
    this.loadEyes()
    this.loadAccessories()
  },
  methods: {
    setBg(index) {
      const canvas = this.canvas
      fabric.Image.fromURL(this.getImgUrl(index), function (img) {
        const scaleFactor = canvas.height / img.height
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          scaleX: scaleFactor / canvas.getZoom(),
          scaleY: scaleFactor / canvas.getZoom(),
        })
      })
    },
    deleteAccessories() {
      const canvas = this.canvas
      canvas.getActiveObjects().forEach((obj) => {
        canvas.remove(obj)
      })
      canvas.discardActiveObject().renderAll()
      this.$store.commit('setSelected', { active: false })
    },
    addAccessory(event) {
      const { index } = event
      const canvas = this.canvas
      fabric.Image.fromURL(this.getAccessoryURL(index), (myImg) => {
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 360,
          top: 360,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.15 / canvas.getZoom(),
          scaleY: scaleFactor * 0.15 / canvas.getZoom(),
        })
        canvas.add(img)
      })
    },
    setFlag(event) {
      const { index, continent } = event
      const canvas = this.canvas
      this.flag.setSrc(this.getFlagURL(index, continent), canvas.renderAll.bind(canvas))
    },
    setEye(event) {
      const { index } = event
      const canvas = this.canvas
      this.eye.setSrc(this.getEyeURL(index), canvas.renderAll.bind(canvas))
    },
    initFlag() {
      const canvas = this.canvas
      fabric.Image.fromURL(this.getFlagURL(0, 'EU'), (myImg) => {
        this.flag = myImg
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 360,
          top: 360,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.75 / canvas.getZoom(),
          scaleY: scaleFactor * 0.75 / canvas.getZoom(),
          selectable: false
        })
        canvas.add(img)
      })
    },
    initStroke() {
      const canvas = this.canvas
      const stroke = require.context('../assets/strokes', false, /\.png$/)('./circle.png')
      fabric.Image.fromURL(stroke, (myImg) => {
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 355,
          top: 360,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.76 / canvas.getZoom(),
          scaleY: scaleFactor * 0.76 / canvas.getZoom(),
          selectable: false,
        })
        canvas.add(img)
      })
    },
    initEye() {
      const canvas = this.canvas
      fabric.Image.fromURL(this.getEyeURL(0), (myImg) => {
        this.eye = myImg
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 400,
          top: 360,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.20 / canvas.getZoom(),
          scaleY: scaleFactor * 0.20 / canvas.getZoom(),
          selectable: false,
        })
        canvas.add(img)
      })
    },
    loadFlags() {
      this.allFlags = {
        EU: require.context('../assets/flags/FL_EU', false, /\.png$/),
        AS: require.context('../assets/flags/FL_AS', false, /\.png$/),
        AM: require.context('../assets/flags/FL_AM', false, /\.png$/),
        AFAU: require.context('../assets/flags/FL_AFAU', false, /\.png$/),
        OT: require.context('../assets/flags/FL_OT', false, /\.png$/),
      }
    },
    loadEyes() {
      this.eyes = require.context('../assets/eyes', false, /\.png$/)
    },
    loadAccessories() {
      this.accessories = require.context('../assets/accessories', false, /\.png$/)
    },
    getEyeURL(index) {
      return this.eyes('./' + index.toString().padStart(3, 0) + '.png')
    },
    getAccessoryURL(index) {
      return this.accessories('./' + index.toString().padStart(3, 0) + '.png')
    },
    getFlagURL(index, continent) {
      return this.allFlags[continent]('./' + index.toString().padStart(3, 0) + '.png')
    },
    getImgUrl(index) {
      return this.flags('./' + index.toString().padStart(3, 0) + '.png')
    },
    fitToContainer(canvas) {
      const size = this.$refs.can.parentNode.clientWidth
      canvas.setWidth(size)
      canvas.setHeight(size)
      canvas.setZoom(size / 720)
    },
    saveImage() {
      download(this.canvas.toDataURL({ multiplier: 720 / this.canvas.width }))
      function download(dataURL) {
        Filesystem.checkPermissions().then(response => {
          if (response && response.publicStorage === 'granted') {
            Filesystem.writeFile({
              path: 'output.png',
              data: dataURL,
              directory: Directory.Documents
            })
          } else if (response && response.publicStorage !== 'denied') {
            Filesystem.requestPermissions()
              .then(response => {
                if (response && response.publicStorage === 'granted') {
                  Filesystem.writeFile({
                    path: 'output.png',
                    data: dataURL,
                    directory: Directory.Documents
                  })
                }
              })
          }
        })
      }
    },
    shareImage() {
      Share.share({
        title: 'See cool stuff',
        text: 'I\'ve made this using Countryballs Stickers',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies',
      })
    }
  },
}
</script>
<style>
.canvas-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
}
</style>
