import './css/site.css';
import 'core-js/es6/promise';
import 'core-js/es6/array';
import Vue from 'vue';
import axios from 'axios';
import configureStore from './configureStore';
import router from './router';
import { sync } from 'vuex-router-sync';
import App from './components/app-root';

Vue.prototype.$http = axios;

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const initialState = window.initialVuexState;
const store = configureStore(null, initialState);

sync(store, router);

const vueApp = new Vue({
	el: '#app',
	store,
	router,
	...App
});
