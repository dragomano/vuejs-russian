<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <p>Текущий компонент: A</p>
  <span style="margin-right: 20px">count: {{ count }}</span>
  <button @click="count++">+</button>
</template>
