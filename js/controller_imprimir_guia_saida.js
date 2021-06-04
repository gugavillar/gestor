(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirGuiaSaidaCtrl(GuiaSaida, ProdutosGuiaSaida, $state) {
		var vm = this;
		vm.guia = GuiaSaida;
		vm.produtos = ProdutosGuiaSaida;

		function print() {
			window.print();
			$state.go('menu.listarsaidas');
		}
		vm.print = print;
	}
	ImprimirGuiaSaidaCtrl.$inject = ['GuiaSaida', 'ProdutosGuiaSaida', '$state'];

	angular.module('GESTOQUE').controller('ImprimirGuiaSaidaCtrl', ImprimirGuiaSaidaCtrl);
}());