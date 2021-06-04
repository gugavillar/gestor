(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirGuiaEntradaCtrl(GuiaEntrada, ProdutosGuiaEntrada, GuiasEntradasResource, $state, $location) {
		var vm = this;
		vm.guia = GuiaEntrada;
		vm.produtos = ProdutosGuiaEntrada;

		function print() {
			window.print();
			$state.go('menu.listarentradas');
		}
		vm.print = print;

		GuiasEntradasResource.fileEntrada().get({ id_entrada_anexoentrada: vm.guia.id_entrada }).$promise.then(function (data) {
			if (data.local_anexoentrada) {
				vm.filenota = $location.absUrl().replace(/#(\S+)/g, '') + '/api/media/notas/' + data.local_anexoentrada;
			}
		});
	}
	ImprimirGuiaEntradaCtrl.$inject = ['GuiaEntrada', 'ProdutosGuiaEntrada', 'GuiasEntradasResource', '$state', '$location'];

	angular.module('GESTOQUE').controller('ImprimirGuiaEntradaCtrl', ImprimirGuiaEntradaCtrl);
}());