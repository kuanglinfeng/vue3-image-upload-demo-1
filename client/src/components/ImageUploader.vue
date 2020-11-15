<template>
  <div class="imagePicker">
    <img
      ref="imageRef"
      src=""
      alt="选择图片"
    >
    <input
      id="imageInput"
      type="file"
      @change="handleInputChange"
    >
    <div class="mask">编辑</div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const apiURL = 'http://localhost:8080'

export default {
  setup() {
    const imageRef = ref()
    onMounted(() => {
      // 临时图片：显示暂无
      const tempURL = 'data:image/jpeg;base64,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'
      imageRef.value.src = window.localStorage.getItem('imageFile') || tempURL
      // 有可能向服务器发送请求 获取图片地址时服务器发生错误（比如图片资源找不到了），此时可显示临时图片
      imageRef.value.onerror = () => {
        imageRef.value.src = tempURL
      }
    })
    const handleInputChange = async (e) => {
      const formData = new FormData()
      formData.append('imageFile', e.target.files[0], e.target.files[0].name)
      const { data } = await axios.post(`${ apiURL }/upload`, formData)
      imageRef.value.src = data.url
      window.localStorage.setItem('imageFile',data.url)
    }
    return { handleInputChange, imageRef }
  }
}
</script>

<style scoped>
.imagePicker {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, .5)
}

.imagePicker img {
  max-width: 100%;
  /*max-height: 100%;*/
  /*vertical-align: top;*/
}

.imagePicker input[type=file] {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}

.imagePicker .mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .5);
  color: white;
}

.imagePicker:hover .mask {
  display: flex;
}
</style>
