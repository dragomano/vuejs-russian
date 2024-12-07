<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Партнёры Vue' }}</template>
    <template #lead>
      <p>
        Партнёры Vue — это агентства, поддерживающие команду Vue, которые
        предоставляют первоклассные услуги по консалтингу и разработке Vue.
        Если ваша компания заинтересована в том, чтобы быть включённой в
        список партнёров, пожалуйста,
        <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
          >зарегистрируйтесь здесь</a
        >.
      </p>
    </template>
  </PageHero>
</template>