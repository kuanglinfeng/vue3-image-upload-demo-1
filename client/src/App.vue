<template>
  <ImageLoader />
</template>

<script>
import ImageLoader from './components/ImageUploader.vue'

export default {
  name: 'App',
  components: {
    ImageLoader
  }
}
</script>

<style>
#app {
  display: flex;
  justify-content: center;
}
</style>
