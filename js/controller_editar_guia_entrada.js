(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarGuiaEntradaCtrl(GuiaEntrada, ProdutosGuiaEntrada, Produtos, ProdutosResource, GuiasEntradasResource) {
		var vm = this, copy;
		vm.dados = GuiaEntrada;
		vm.produtosNota = ProdutosGuiaEntrada;
		vm.produtos = Produtos;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function getPrice(id_produto) {
			ProdutosResource.get({ id_produto: id_produto }).$promise.then(function (data) {
				vm.itens.valor_produto_itensentrada = data.valor_produto;
				$(document).ready(function () {
					M.updateTextFields();
				});
			});
		}
		vm.getPrice = getPrice;

		function inserir() {
			vm.itens.id_entrada_itensentrada = vm.dados.id_entrada;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			GuiasEntradasResource.itensEntrada().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itensentrada) {
					vm.produtos.filter(function (el) {
						if (el.id_produto === copy.id_produto_itensentrada) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					GuiasEntradasResource.itensEntrada().get({ id_itensentrada: data.id_itensentrada }).$promise.then(function (data) {
						vm.produtosNota.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itensentrada, id_produto) {
			GuiasEntradasResource.itensEntrada().delete({ id_itensentrada: id_itensentrada }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosNota = vm.produtosNota.filter(function (el) {
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
	EditarGuiaEntradaCtrl.$inject = ['GuiaEntrada', 'ProdutosGuiaEntrada', 'Produtos', 'ProdutosResource', 'GuiasEntradasResource'];

	angular.module('GESTOQUE').controller('EditarGuiaEntradaCtrl', EditarGuiaEntradaCtrl);
}());