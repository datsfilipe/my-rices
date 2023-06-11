<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ title: string, img: string, link?: string }>()

const fullScreen = ref(false);
const toggle = () => fullScreen.value = !fullScreen.value;
</script>

<template>
  <div class="card">
    <div v-if="!fullScreen">
      <h1 class="title">{{ title }}</h1>
      <img :src="img" :alt="title" @click="toggle"/>
      <a v-if="link" :href="link" target="_blank" class="link">
        <i class="external-link-alt">
          External link to original post.
        </i>
      </a>
    </div>
    <div v-else class="full-screen">
      <div class="full-screen-bg" @click="toggle"/>
      <img :src="img" :alt="title"/>
    </div>
  </div>
</template>
