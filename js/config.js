(function () {
	'use strict';
	/*global angular*/

	function configLoadingBar(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
		cfpLoadingBarProvider.spinnerTemplate = '<div class="right-align"><div class="preloader-wrapper small active"><div class="spinner-layer spinner-yellow-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>Carregando aguarde...</div>';
	}
	configLoadingBar.$inject = ['cfpLoadingBarProvider'];

	function configHttp($httpProvider) {
		$httpProvider.defaults.headers.common.Authorization = sessionStorage.getItem('token');
	}
	configHttp.$inject = ['$httpProvider'];

	angular.module('GESTOQUE').config(configLoadingBar).config(configHttp);
}());