<template>
  <div class="googleMaps">
    <div class="loader" v-if="loading">
      <div class="body">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div class="base">
          <span></span>
          <div class="face"></div>
        </div>
      </div>
      <div class="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1 id="timer">Loading Map</h1>
    </div>
    <gmap @loading="loading = $event" />
  </div>
</template>

<script src="./google-maps.js" lang="js" />

<style scoped src="./_google-maps.scss" lang="scss" />
