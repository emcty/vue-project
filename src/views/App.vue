<template>
  <div id="app">
    <header>
      <router-link to="/home">Home</router-link>
      <router-link to="/docs">Docs</router-link>
    </header>
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<style>
body {
  background: #eee;
}
</style>
