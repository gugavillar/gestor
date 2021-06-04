(function () {
	'use strict';
	/*global M, angular, $*/
	function ProdutosCtrl(ProdutosResource) {
		var vm = this, copy;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			ProdutosResource.save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_produto) {
					M.toast({ html: 'Produto cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /PRODUTO UNICO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Produto já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
			$(document).ready(function () {
				$('select').formSelect();
			});
		}
		vm.cadastrar = cadastrar;
	}
	ProdutosCtrl.$inject = ['ProdutosResource'];

	angular.module('GESTOQUE').controller('ProdutosCtrl', ProdutosCtrl);
}());