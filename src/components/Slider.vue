<script setup lang="ts">
import SliderItem from './SliderItem.vue';
import posts from '../utils/posts.json';
import { ref } from 'vue'

const current = ref(0)
const increment = () => current.value++
const decrement = () => current.value--
</script>

<template>
  <div class="slider">
    <button @click="decrement" :disabled="current === 0">Prev</button>
    <button class="next" @click="increment" :disabled="current === posts.length - 1">Next</button>
    <SliderItem :key="current" :title="posts[current].title" :img="posts[current].image" :link="posts[current].link"/>
  </div>
</template>
