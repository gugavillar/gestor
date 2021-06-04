(function () {
	'use strict';
	/*global M, angular, $*/
	function DashboardCtrl(DashboardContratosTipos, DashboardContratosDiasTermino, DashboardSaldoProdutosContrato, DashboardSaldoProdutosEstoque) {
		var vm = this;
		vm.contratostipos = DashboardContratosTipos;
		vm.contratosdiastermino = DashboardContratosDiasTermino;
		vm.saldoprodutoscontrato = DashboardSaldoProdutosContrato;
		vm.saldoprodutosestoque = DashboardSaldoProdutosEstoque;
	}
	DashboardCtrl.$inject = ['DashboardContratosTipos', 'DashboardContratosDiasTermino', 'DashboardSaldoProdutosContrato', 'DashboardSaldoProdutosEstoque'];

	angular.module('GESTOQUE').controller('DashboardCtrl', DashboardCtrl);
}());