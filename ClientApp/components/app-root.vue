<template>
	<div class="container-fluid">
		<!--<div class="row">
			<div class="col-sm-3">
				<nav-menu params="route: route"></nav-menu>
			</div>
			<div class="col-sm-9">
				<router-view></router-view>
			</div>
		</div>-->
		{{ message }}
	</div>
</template>

<script>
	import Vue from 'vue'
	//import CounterExample from './counter-example'
	//import FetchData from './fetch-data'
	//import HomePage from './home-page'
	//import NavMenu from './nav-menu'

	//Vue.component('counter-example', CounterExample);
	//Vue.component('fetch-data', FetchData);
	//Vue.component('home-page', HomePage);
	//Vue.component('nav-menu', NavMenu);

	export default {
		data() {
			return {
				message: 'Client side rendered!'
			}
		}
	}
</script>

<style>

</style>
