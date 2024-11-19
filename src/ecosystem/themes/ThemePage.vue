<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Темы</template>
      <template #lead
        >Ознакомьтесь с темами, наборами пользовательского интерфейса и
        плагинами. Вы можете увидеть, как наши партнёры создают реальные
        приложения на основе Vue.</template
      >
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Хотите представить здесь свои темы?
      <a
        class="link"
        href="mailto:evan@vuejs.org?subject=Theme+affiliation"
        >Свяжитесь с нами!</a
      >
    </ThemeContact>
  </div>
</template>
