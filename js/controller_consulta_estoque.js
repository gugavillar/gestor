(function () {
	'use strict';
	/*global M, angular, $*/
	function ConsultarEstoqueCtrl(Estoque) {
		var vm = this;
		vm.data = new Date();
		vm.produtosestoque = Estoque;
	}
	ConsultarEstoqueCtrl.$inject = ['Estoque'];

	angular.module('GESTOQUE').controller('ConsultarEstoqueCtrl', ConsultarEstoqueCtrl);
}());