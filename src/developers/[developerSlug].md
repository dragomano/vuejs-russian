---
page: true
footer: false
title: Разработчик Vue
---

<script setup>
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'
import developersData from './developers.json'
import Page from './components/DeveloperPage.vue'

const { page } = useData()
const developer = ref(developersData.find(dev => dev.slug === page.value.params.developerSlug) || {})

onMounted(() => {
  if (developer.value) {
    document.title = `${developer.value.name} - разработчик Vue | Vue.js`
  }
})
</script>

<Page :developer="developer" />
