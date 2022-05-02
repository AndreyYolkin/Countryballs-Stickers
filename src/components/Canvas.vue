<template>
  <div id="canvas" ref="can"></div>
</template>

<script>
import dayjs from 'dayjs'

import Konva from 'konva'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Mediastore } from '@agorapulse/capacitor-mediastore'
import { useStore } from '../store'

export default {
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
      canvas: () => {},
      layer: () => {},
      allFlags: () => {},
      allBacks: () => {},
      eyes: () => {},
      accessories: () => {},
      flag: () => {},
      back: () => {},
      eye: () => {},
      stroke: () => {},

      texts: new Set(),
      transformer: () => {}
    }
  },
  async mounted() {
    const ref = this.$refs.can
    this.canvas = new Konva.Stage({
      container: ref,
      width: window.innerWidth,
      height: window.innerHeight,
    })
    this.layer = new Konva.Layer()
    // create TextNode to load font in Konva
    // eslint-disable-next-line no-unused-vars
    const text = new Konva.Text({
      fontFamily: 'RubikVariable',
    })

    this.canvas.add(this.layer)

    this.initTransformer()
    this.fitToContainer(this.canvas)
    await this.initBack()
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
    rerender() {
      const canvas = this.canvas
      canvas.renderAll()
    },
    deleteAccessories() {
      this.transformer.nodes().forEach((obj) => {
        obj.destroy()
      })
      this.transformer.nodes([])
      this.store.setSelected({ active: false })
    },
    initTransformer() {
      const canvas = this.canvas
      const trLayer = new Konva.Layer()
      canvas.add(trLayer)
      const transformer = new Konva.Transformer({ keepRatio: true })
      this.transformer = transformer
      trLayer.add(transformer)
      const selectionRectangle = new Konva.Rect({
        fill: 'rgba(100,85,236,0.35)',
        visible: false,
      })
      trLayer.add(selectionRectangle)

      let x1, y1, x2, y2
      canvas.on('mousedown touchstart', (e) => {
        if (e.target.hasName('draggable') || e.target.hasName('_anchor') || e.target.hasName('draggableChild')) {
          return
        }
        const scale = canvas.getAttrs().scaleX
        e.evt.preventDefault()
        x1 = canvas.getPointerPosition().x / scale
        y1 = canvas.getPointerPosition().y / scale
        x2 = canvas.getPointerPosition().x / scale
        y2 = canvas.getPointerPosition().y / scale
        selectionRectangle.visible(true)
        selectionRectangle.width(0)
        selectionRectangle.height(0)
      })

      canvas.on('mousemove touchmove', (e) => {
        const scale = canvas.getAttrs().scaleX
        if (!selectionRectangle.visible()) {
          return
        }
        e.evt.preventDefault()
        x2 = canvas.getPointerPosition().x / scale
        y2 = canvas.getPointerPosition().y / scale

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        })
      })

      canvas.on('mouseup touchend', (e) => {
        if (!selectionRectangle.visible()) {
          return
        }
        e.evt.preventDefault()
        setTimeout(() => {
          selectionRectangle.visible(false)
        })
        const shapes = canvas.find('.draggable')
        const box = selectionRectangle.getClientRect()
        const selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        )
        this.$emit('objectselected')
        this.store.setSelected({ active: selected.length, selected, texts: selected.filter(s => this.texts.has(s)) })
        transformer.nodes(selected)
      })

      canvas.on('click tap', (e) => {
        if (selectionRectangle.visible()) {
          return
        }
        let element = e.target

        if (element === canvas) {
          transformer.nodes([])
          return
        }

        if (!element.hasName('draggable') && !element.hasName('draggableChild')) {
          return
        }

        if (element.hasName('draggableChild')) {
          element = element.parent
        }

        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey
        const isSelected = transformer.nodes().indexOf(element) >= 0

        if (!metaPressed && !isSelected) {
          this.store.setSelected({ active: true, selected: [element], texts: [element].filter(s => this.texts.has(s)) })
          transformer.nodes([element])
        } else if (metaPressed && isSelected) {
          const nodes = transformer.nodes().slice()
          nodes.splice(nodes.indexOf(element), 1)
          this.store.setSelected({ active: nodes.length, selected: nodes, texts: nodes.filter(s => this.texts.has(s)) })
          transformer.nodes(nodes)
        } else if (metaPressed && !isSelected) {
          const nodes = transformer.nodes().concat([element])
          this.store.setSelected({ active: nodes.length, selected: nodes, texts: nodes.filter(s => this.texts.has(s)) })
          transformer.nodes(nodes)
        }
      })
    },
    createTextField() {
      const tooltip = new Konva.Label({
        name: 'draggable',
        x: 270,
        y: 475,
        draggable: true
      })
      tooltip.add(
        new Konva.Tag({
          fill: '#fff',
          pointerWidth: 10,
          pointerHeight: 10,
          lineJoin: 'round',
          cornerRadius: 20,
          name: 'draggableChild'
        })
      )
      const textbox = new Konva.Text({
        text: this.$t('app.text.defaultText'),
        fontSize: 36,
        fill: '#1d1d1b',
        fontFamily: 'RubikVariable',
        fontWeight: 500,
        padding: 15,
        textAlign: 'center',
        name: 'draggableChild'
      })
      tooltip.add(textbox)

      tooltip.on('dblclick dbltap', () => {
        tooltip.hide()
        const nodes = []
        this.store.setSelected({ active: nodes.length, selected: nodes, texts: nodes.filter(s => this.texts.has(s)) })
        this.transformer.hide()

        const textarea = document.createElement('div')
        textarea.classList.add('textarea')
        document.querySelector('#canvas').appendChild(textarea)
        textarea.innerText = textbox.text()
        textarea.setAttribute('contenteditable', true)
        textarea.style.fontSize = textbox.fontSize() * this.canvas.getAttrs().scaleX + 'px'
        textarea.style.lineHeight = textbox.lineHeight()
        textarea.style.fontFamily = textbox.fontFamily()
        textarea.style.transformOrigin = 'left top'
        textarea.style.color = '#fff'
        textarea.style.backgroundColor = '#1118'

        textarea.focus()

        const removeTextarea = () => {
          textarea.parentNode.removeChild(textarea)
          window.removeEventListener('click', handleOutsideClick)
          tooltip.show()
          const nodes = this.transformer.nodes().slice()
          this.store.setSelected({ active: nodes.length, selected: nodes, texts: nodes.filter(s => this.texts.has(s)) })
          this.transformer.show()
          this.transformer.forceUpdate()
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            newWidth = textbox.placeholder.length * textbox.fontSize()
          }
          const isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          )
          const isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth)
          }
          const isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent)
          if (isEdge) {
            newWidth += 1
          }
          textarea.style.width = newWidth + 'px'
        }

        textarea.addEventListener('keydown', (e) => {
          if ((e.key === 'Enter' || e.key === 'NumpadEnter') && !e.shiftKey) {
            textbox.text(textarea.innerText)
            removeTextarea()
          }
          if (e.key === 'Escape') {
            removeTextarea()
          }
        })

        textarea.addEventListener('keydown', function (e) {
          const scale = textbox.getAbsoluteScale().x
          setTextareaWidth(textbox.width() * scale)
          textarea.style.height = 'auto'
          textarea.style.height =
            textarea.scrollHeight + textbox.fontSize() + 'px'
        })

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textbox.text(textarea.innerText)
            removeTextarea()
          }
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick)
        })
      })
      this.texts.add(tooltip)
      this.layer.add(tooltip)
    },
    addAccessory(event) {
      const { index } = event
      const canvas = this.canvas
      Konva.Image.fromURL(this.getAccessoryURL(index), (myImg) => {
        const scaleFactor = canvas.height() / myImg.height()
        myImg.setAttrs({
          name: 'draggable',
          x: 360,
          y: 380,
          originX: 'center',
          originY: 'center',
          scaleX: scaleFactor * 0.15 / canvas.getAttrs().scaleX,
          scaleY: scaleFactor * 0.15 / canvas.getAttrs().scaleX,
          draggable: true
        })
        this.layer.add(myImg)
      })
    },
    setFlag(event) {
      const { index, continent, url } = event
      const flagImage = new Image()
      flagImage.onload = () => {
        this.flag.image(flagImage)
      }
      if (url) {
        this.cropFlag(url).then(flag => {
          flagImage.src = flag
        })
      } else {
        flagImage.src = this.getFlagURL(index, continent)
      }
    },
    setEye(event) {
      const { index } = event
      const oldWidth = this.eye.width()
      const oldHeight = this.eye.height()
      const eyeImg = new Image()
      eyeImg.onload = () => {
        this.eye.image(eyeImg)
        this.$nextTick().then(() => {
          this.eye.x(this.eye.x() + (oldWidth - this.eye.width()) / 2)
          this.eye.y(this.eye.y() + (oldHeight - this.eye.height()) / 2)
        })
      }
      eyeImg.src = this.getEyeURL(index)
    },
    setBack(event) {
      const backImage = new Image()
      backImage.onload = () => {
        this.back.image(backImage)
      }
      const { index, pack, url } = event
      if (url) {
        this.cropBack(url).then(image => {
          backImage.src = image
        })
      } else {
        backImage.src = this.getBackURL(index, pack)
      }
    },
    initBack() {
      return new Promise(resolve => {
        Konva.Image.fromURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC', (myImg) => {
          this.back = myImg
          myImg.setAttrs({
            x: 0,
            y: 0,
            width: 720,
            height: 720,
            selectable: false,
            draggable: false
          })
          this.layer.add(myImg)
          resolve()
        })
      })
    },
    initFlag() {
      return new Promise(resolve => {
        Konva.Image.fromURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC', (myImg) => {
          this.flag = myImg
          myImg.setAttrs({
            x: 90,
            y: 110,
            width: 540,
            height: 540,
            selectable: false,
            draggable: false
          })
          this.layer.add(myImg)
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
        img.onload = cropFlag
        img.src = src
        function cropFlag() {
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
        img.onload = cropBack
        img.src = src
        function cropBack() {
          ctx.drawImage(img, 0, 0, 720, 720)
          resolve(canvas.toDataURL())
        }
      })
    },
    initStroke() {
      const stroke = require.context('../assets/strokes', false, /\.png$/)('./circle.png')
      Konva.Image.fromURL(stroke, (myImg) => {
        this.stroke = myImg
        myImg.setAttrs({
          x: 78,
          y: 100,
          width: 564 / myImg.width() * myImg.height(),
          height: 564,
          selectable: false,
        })
        this.layer.add(myImg)
      })
    },
    setStroke(name) {
      const stroke = require.context('../assets/strokes', false, /\.png$/)(`./${name}.png`)
      const strokeImage = new Image()
      strokeImage.onload = () => {
        this.stroke.image(strokeImage)
      }
      strokeImage.src = stroke
    },
    setEyesPosition({ x, y }) {
      this.eye.x(260 + x)
      this.eye.y(290 + y)
    },
    initEye() {
      const canvas = this.canvas
      Konva.Image.fromURL(this.getEyeURL(0), (myImg) => {
        this.eye = myImg
        const scaleFactor = canvas.height() / myImg.height()
        myImg.setAttrs({
          x: 260,
          y: 290,
          scaleX: scaleFactor * 0.20 / canvas.getAttrs().scaleX,
          scaleY: scaleFactor * 0.20 / canvas.getAttrs().scaleX,
          selectable: false,
        })
        this.layer.add(myImg)
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
      canvas.scale({ x: size / 720, y: size / 720 })
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
      this.store.setSnackBar({ text: this.$t('app.saved'), status: 'success' })
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
.textarea {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  resize: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: medium;
}
</style>
