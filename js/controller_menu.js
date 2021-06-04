(function () {
	'use strict';
	/*global M, angular, $*/
	function MenuCtrl(LoginResource, $state) {
		var vm = this;

		$(document).ready(function () {
			$('.sidenav').sidenav({
				draggable: true
			});
			$('.collapsible').collapsible();
			$('footer').css({
				'padding-left': 300
			});
		});

		function logout() {
			LoginResource.delCred();
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuCtrl.$inject = ['LoginResource', '$state'];

	angular.module('GESTOQUE').controller('MenuCtrl', MenuCtrl);
}());