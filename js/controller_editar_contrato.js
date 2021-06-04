(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarContratoCtrl(Contrato, Produtos, ProdutosContrato, ProdutosResource, ContratosResource) {
		var vm = this, copy;
		vm.produtosContrato = ProdutosContrato;
		vm.contrato = Contrato;
		vm.produtos = Produtos;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function getPrice(id_produto) {
			ProdutosResource.get({ id_produto: id_produto }).$promise.then(function (data) {
				vm.itens.valor_produto_itenscontrato = data.valor_produto;
				$(document).ready(function () {
					M.updateTextFields();
				});
			});
		}
		vm.getPrice = getPrice;

		function inserir() {
			vm.itens.id_contrato_itenscontrato = vm.contrato.id_contrato;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			ContratosResource.itensContrato().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itenscontrato) {
					vm.produtos.filter(function (el) {
						if (el.id_produto === copy.id_produto_itenscontrato) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					ContratosResource.itensContrato().get({ id_itenscontrato: data.id_itenscontrato }).$promise.then(function (data) {
						vm.produtosContrato.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itenscontrato, id_produto) {
			ContratosResource.itensContrato().delete({ id_itenscontrato: id_itenscontrato }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosContrato = vm.produtosContrato.filter(function (el) {
						if (el.id_produto !== id_produto) {
							return el;
						}
					});
					vm.produtos.filter(function (el) {
						if (el.id_produto === id_produto) {
							delete el.disabled;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					M.toast({ html: 'Item excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma Falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	EditarContratoCtrl.$inject = ['Contrato', 'Produtos', 'ProdutosContrato', 'ProdutosResource', 'ContratosResource'];

	angular.module('GESTOQUE').controller('EditarContratoCtrl', EditarContratoCtrl);
}());