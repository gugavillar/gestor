(function () {
	'use strict';
	/*global M, angular, $*/
	function ImprimirOrdemCtrl(Ordem, ProdutosOrdemFornecimento, $state) {
		var vm = this;
		vm.ordem = Ordem;
		vm.produtos = ProdutosOrdemFornecimento;
		if (Ordem.prioridade_ordemfornecimento === '3') {
			$('body').addClass('maxima');
		} else if (Ordem.prioridade_ordemfornecimento === '2') {
			$('body').addClass('urgente');
		} else {
			$('body').removeClass('maxima urgente');
		}

		function print() {
			window.print();
			$state.go('menu.listarordens');
		}
		vm.print = print;

	}
	ImprimirOrdemCtrl.$inject = ['Ordem', 'ProdutosOrdemFornecimento', '$state'];

	angular.module('GESTOQUE').controller('ImprimirOrdemCtrl', ImprimirOrdemCtrl);
}());