<template>
  <canvas ref="can" width="200" height="200"></canvas>
</template>

<script>
import { fabric } from "fabric";

export default {
  data: function () {
    return {
      canvas: null,
    };
  },
  mounted() {
    const ref = this.$refs.can;
    this.fitToContainer(ref);
    this.canvas = new fabric.StaticCanvas(ref);
    const rect = new fabric.Rect({
      fill: "red",
      width: 20,
      height: 20,
    });
    this.canvas.add(rect);
  },
  created() {
    this.loadFlags();
  },
  methods: {
    setBg(index) {
      const canvas = this.canvas;
      fabric.Image.fromURL(this.getImgUrl(index), function (img) {
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let left, top, scaleFactor;

        if (canvasAspect >= imgAspect) {
          scaleFactor = canvas.width / img.width;
          left = 0;
          top = -(img.height * scaleFactor - canvas.height) / 2;
        } else {
          scaleFactor = canvas.height / img.height;
          top = 0;
          left = -(img.width * scaleFactor - canvas.width) / 2;
        }
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          left: left,
          top: top,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
        });
      });
    },
    loadFlags() {
      this.flags = require.context("../assets/buttons/FL_EU", false, /\.png$/);
    },
    getImgUrl(index) {
      return this.flags("./" + index.toString().padStart(3, 0) + ".png");
    },
    fitToContainer(canvas) {
      // Make it visually fill the positioned parent
      canvas.style.width = "100%";
      canvas.style.position = "absolute";
      canvas.style.height = "100%";
      // ...then set the internal size to match
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (canvas.nextElementSibling) {
        const upper_canvas = canvas.nextElementSibling;
        upper_canvas.style.width = "100%";
        upper_canvas.style.position = "absolute";
        upper_canvas.style.height = "100%";
        // ...then set the internal size to match
        upper_canvas.width = upper_canvas.offsetWidth;
        upper_canvas.height = upper_canvas.offsetHeight;
      }
    },
  },
};
</script>
<style>
.canvas-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
}
</style>