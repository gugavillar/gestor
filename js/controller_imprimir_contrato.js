(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirContratoCtrl(Contrato, ProdutosContrato, ContratosResource, $state, $location) {
		var vm = this;
		vm.contrato = Contrato;
		vm.produtos = ProdutosContrato;

		function print() {
			window.print();
			$state.go('menu.listarcontratos');
		}
		vm.print = print;

		ContratosResource.fileContrato().get({ id_contrato_anexocontrato: vm.contrato.id_contrato }).$promise.then(function (data) {
			if (data.local_anexocontrato) {
				vm.filecontrato = $location.absUrl().replace(/#(\S+)/g, '') + '/api/media/contratos/' + data.local_anexocontrato;
			}
		});
	}
	ImprimirContratoCtrl.$inject = ['Contrato', 'ProdutosContrato', 'ContratosResource', '$state', '$location'];

	angular.module('GESTOQUE').controller('ImprimirContratoCtrl', ImprimirContratoCtrl);
}());