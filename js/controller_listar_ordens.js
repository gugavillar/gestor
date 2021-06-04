(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaOrdensCtrl(ListaOrdens, OrdensResource, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('#excluir_ordem').modal();
			$('#excluir_ordem_aviso').modal();
			$('.tooltipped').tooltip();
		});

		vm.guides = ListaOrdens;
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

		function search() {
			vm.guides = $filter('filter')(ListaOrdens, { num_ordemfornecimento: vm.query }, true);
		}
		vm.search = search;

		function excluir(id_ordemfornecimento) {
			OrdensResource.ordens().delete({ id_ordemfornecimento: id_ordemfornecimento }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.guides = vm.guides.filter(function (elem) {
						if (elem.id_ordemfornecimento !== id_ordemfornecimento) {
							return elem;
						}
					});
					M.toast({ html: 'Ordem excluída com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;

		function modal(id_ordemfornecimento, num_ordemfornecimento) {
			vm.num_ordemfornecimento = num_ordemfornecimento;
			vm.id_ordemfornecimento = id_ordemfornecimento;
			OrdensResource.produtosOrdem().query({ id_ordemfornecimento: id_ordemfornecimento }).$promise.then(function (data) {
				if (data.length) {
					$('#excluir_ordem_aviso').modal('open');
				} else {
					$('#excluir_ordem').modal('open');
				}
			});
		}
		vm.modal = modal;
	}
	ListaOrdensCtrl.$inject = ['ListaOrdens', 'OrdensResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaOrdensCtrl', ListaOrdensCtrl);
}());