(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaProdutosCtrl(Produtos, ProdutosResource, $filter) {
		var vm = this;
		vm.produtos = Produtos;
		vm.config = {
			itemsPerPage: 5,
			fillLastPage: true,
			maxPages: 5,
			paginatorLabels: {
				first: '<<',
				last: '>>',
				stepBack: '<',
				stepAhead: '>'
			}
		};

		$(document).ready(function () {
			$('#excluir_produto').modal();
			$('.tooltipped').tooltip();
		});

		function search() {
			vm.produtos = $filter('filter')(Produtos, vm.query, { descricao_produto: vm.query }, true);
		}
		vm.search = search;

		function modal(produto) {
			vm.modal_data = produto;
			$('#excluir_produto').modal('open');
		}
		vm.modal = modal;

		function excluir(id_produto) {
			ProdutosResource.delete({ id_produto: id_produto }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtos = vm.produtos.filter(function (elem) {
						if (elem.id_produto !== id_produto) {
							return elem;
						}
					});
					M.toast({ html: 'Produto excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaProdutosCtrl.$inject = ['Produtos', 'ProdutosResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaProdutosCtrl', ListaProdutosCtrl);
}());