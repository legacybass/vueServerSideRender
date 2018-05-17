import Vue from 'vue'
//import axios from 'axios'
//import router from './router'
//import store from './store'
//import { sync } from 'vuex-router-sync'
//import App from 'components/app-root'

//Vue.prototype.$http = axios;

//sync(store, router)

const app = new Vue({
	//store,
	//router,
	//...App,
	data: {
		message: 'blah'
	},
	template: '<h1>{{ message }}</h1>'
})

export {
	app,
	//router,
	//store
}
