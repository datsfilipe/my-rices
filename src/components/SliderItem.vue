<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ title: string, img: string }>()

const fullScreen = ref(false);
const toggle = () => fullScreen.value = !fullScreen.value;
</script>

<template>
  <div class="card">
    <div v-if="!fullScreen">
      <h1 class="title">{{ title }}</h1>
      <img :src="img" :alt="title" @click="toggle"/>
    </div>
    <div v-else class="full-screen">
      <div class="full-screen-bg" @click="toggle"/>
      <img :src="img" :alt="title"/>
    </div>
  </div>
</template>
