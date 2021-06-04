(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarProdutoCtrl(Produto, ProdutosResource, $state) {
		var vm = this, copy;
		vm.novo = Produto;

		function reload() {
			$state.go('menu.listarprodutos');
		}

		$(document).ready(function () {
			$('select').formSelect();
			M.updateTextFields();
		});

		function editar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			ProdutosResource.update({ id_produto: copy.id_produto }, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Produto alterado com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.editar = editar;
	}
	EditarProdutoCtrl.$inject = ['Produto', 'ProdutosResource', '$state'];

	angular.module('GESTOQUE').controller('EditarProdutoCtrl', EditarProdutoCtrl);
}());