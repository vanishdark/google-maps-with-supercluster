<template>
  <v-main>
    <v-container fluid>
      <router-view :key="$route.path" />
    </v-container>
  </v-main>
</template>

<script src="./view.js" />

<style scoped src="./_view.scss" lang="scss" />
