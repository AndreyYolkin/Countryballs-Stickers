<template>
  <canvas ref="can" />
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'

import { fabric } from 'fabric'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Mediastore } from '@agorapulse/capacitor-mediastore'

import '@/utils/fabric.js'

export default {
  data () {
    return {
      canvas: () => {},
      allFlags: () => {},
      allBacks: () => {},
      eyes: () => {},
      accessories: () => {},
      flag: () => {},
      back: () => {},
      eye: () => {},
      stroke: () => {},

      texts: new Set(),
    }
  },
  async mounted() {
    const ref = this.$refs.can
    this.canvas = new fabric.Canvas(ref)
    this.fitToContainer(this.canvas)
    this.$nextTick(() => {
      window.addEventListener('resize', () => this.fitToContainer(this.canvas))
      this.canvas.on('selection:created', (objects) => {
        this.$emit('objectselected')
        this.$store.commit('setSelected', { active: true, objects, texts: objects.selected.filter(s => this.texts.has(s)) })
      })
      this.canvas.on('selection:updated', (objects) => {
        this.$emit('objectselected')
        this.$store.commit('setSelected', { active: true, objects, texts: objects.selected.filter(s => this.texts.has(s)) })
      })
      this.canvas.on('selection:cleared', () => {
        this.$emit('objectselected', [])
        this.$store.commit('setSelected', { active: false, texts: [] })
      })
    })
    await this.initFlag()
    this.initStroke()
    this.initEye()
  },
  created() {
    this.loadFlags()
    this.loadBacks()
    this.loadEyes()
    this.loadAccessories()
  },
  methods: {
    ...mapMutations({
      $setSnackBar: 'setSnackbar'
    }),
    rerender() {
      const canvas = this.canvas
      canvas.renderAll()
    },
    deleteAccessories() {
      const canvas = this.canvas
      canvas.getActiveObjects().forEach((obj) => {
        canvas.remove(obj)
        this.texts.remove(obj)
      })
      canvas.discardActiveObject().renderAll()
      this.$store.commit('setSelected', { active: false })
    },
    createTextField() {
      const canvas = this.canvas
      const textbox = new fabric.Textbox('Canvas', {
        left: 360,
        top: 380,
        fontSize: 36,
        fill: '#1d1d1b',
        textBackgroundColor: '#fff',
        fontFamily: 'RubikVariable',
        fontWeight: 500,
        padding: 15,
        textAlign: 'center',
      })
      this.texts.add(textbox)
      canvas.add(textbox)
    },
    addAccessory(event) {
      const { index } = event
      const canvas = this.canvas
      fabric.Image.fromURL(this.getAccessoryURL(index), (myImg) => {
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 360,
          top: 380,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.15 / canvas.getZoom(),
          scaleY: scaleFactor * 0.15 / canvas.getZoom(),
        })
        canvas.add(img)
      })
    },
    setFlag(event) {
      const { index, continent, url } = event
      const canvas = this.canvas
      if (url) {
        this.cropFlag(url).then(flag => {
          this.flag.setSrc(flag, canvas.renderAll.bind(canvas))
        })
      } else {
        this.flag.setSrc(this.getFlagURL(index, continent), canvas.renderAll.bind(canvas))
      }
    },
    setEye(event) {
      const { index } = event
      const canvas = this.canvas
      this.eye.setSrc(this.getEyeURL(index), canvas.renderAll.bind(canvas))
    },
    setBack(event) {
      const canvas = this.canvas
      const { index, pack, url } = event
      if (url) {
        this.cropBack(url).then(img => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
          })
        })
      } else {
        fabric.Image.fromURL(this.getBackURL(index, pack), function (img) {
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
      }
    },
    initFlag() {
      return new Promise(resolve => {
        const canvas = this.canvas
        fabric.Image.fromURL(this.getFlagURL(0, 'EU'), (myImg) => {
          this.flag = myImg
          const scaleFactor = canvas.height / myImg.height
          const img = myImg.set({
            left: 360,
            top: 380,
            originX: 'center',
            originY: 'center',
            scaleX: scaleFactor * 0.75 / canvas.getZoom(),
            scaleY: scaleFactor * 0.75 / canvas.getZoom(),
            selectable: false
          })
          canvas.add(img)
          resolve()
        })
      })
    },
    cropFlag(src) {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas')
        canvas.height = 720
        canvas.width = 720
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const img = new Image()
        img.onload = start
        img.src = src
        function start() {
          ctx.drawImage(img, 0, 0, 720, 720)
          ctx.globalCompositeOperation = 'destination-in'
          ctx.beginPath()
          ctx.arc(360, 360, 360, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
          resolve(canvas.toDataURL())
        }
      })
    },
    cropBack(src) {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas')
        canvas.height = 720
        canvas.width = 720
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const img = new Image()
        img.onload = start
        img.src = src
        function start() {
          ctx.drawImage(img, 0, 0, 720, 720)
          resolve(canvas.toDataURL())
        }
      })
    },
    initStroke() {
      const canvas = this.canvas
      const stroke = require.context('../assets/strokes', false, /\.png$/)('./circle.png')
      fabric.Image.fromURL(stroke, (myImg) => {
        this.stroke = myImg
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 355,
          top: 380,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.76 / canvas.getZoom(),
          scaleY: scaleFactor * 0.76 / canvas.getZoom(),
          selectable: false,
        })
        canvas.add(img)
      })
    },
    setStroke(name) {
      const canvas = this.canvas
      const stroke = require.context('../assets/strokes', false, /\.png$/)(`./${name}.png`)
      this.stroke.setSrc(stroke, canvas.renderAll.bind(canvas))
    },
    setEyesPosition({ x, y }) {
      this.eye.left = 400 + x
      this.eye.top = 380 + y
      const canvas = this.canvas
      canvas.renderAll.bind(canvas)()
    },
    initEye() {
      const canvas = this.canvas
      fabric.Image.fromURL(this.getEyeURL(0), (myImg) => {
        this.eye = myImg
        const scaleFactor = canvas.height / myImg.height
        const img = myImg.set({
          left: 400,
          top: 380,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.20 / canvas.getZoom(),
          scaleY: scaleFactor * 0.20 / canvas.getZoom(),
          selectable: false,
        })
        canvas.add(img)
      })
    },
    loadBacks() {
      this.allBacks = {
        BO: require.context('../assets/backs/BG_BO', false, /\.png$/),
        GE: require.context('../assets/backs/BG_GE', false, /\.png$/),
        ME: require.context('../assets/backs/BG_ME', false, /\.png$/),
      }
    },
    loadFlags() {
      this.allFlags = {
        EU: require.context('../assets/flags/FL_EU', false, /\.png$/),
        AS: require.context('../assets/flags/FL_AS', false, /\.png$/),
        AM: require.context('../assets/flags/FL_AM', false, /\.png$/),
        AF: require.context('../assets/flags/FL_AF', false, /\.png$/),
        AU: require.context('../assets/flags/FL_AU', false, /\.png$/),
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
    getBackURL(index, pack) {
      return this.allBacks[pack]('./' + index.toString().padStart(3, 0) + '.png')
    },
    fitToContainer(canvas) {
      const size = this.$refs.can.parentNode.clientWidth
      canvas.setWidth(size)
      canvas.setHeight(size)
      canvas.setZoom(size / 720)
    },
    _saveImage() {
      return new Promise((resolve, reject) => {
        Filesystem.writeFile({
          path: `sticker_${dayjs().format('YYYY_MM_DDTHH_mm_ss')}.png`,
          data: this.canvas.toDataURL({ multiplier: 720 / this.canvas.width }),
          directory: Directory.Cache
        })
          .then(result => {
            Mediastore.savePicture({
              album: 'Countryballs',
              path: result.uri,
              filename: `sticker_${dayjs().format('YYYY_MM_DDTHH_mm_ss')}.png`,
            })
            resolve(result)
          })
      })
    },
    async downloadImage() {
      await this._saveImage()
      this.$setSnackBar({ text: this.$t('app.saved'), status: 'success' })
    },
    async shareImage() {
      const result = await this._saveImage()
      Share.share({
        title: 'See cool stuff',
        text: 'I\'ve made this using Countryballs Stickers',
        url: result.uri,
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
