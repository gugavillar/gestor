(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaContratosCtrl(ListaContratos, ContratosResource, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('#excluir_contrato').modal();
			$('#excluir_contrato_aviso').modal();
			$('.tooltipped').tooltip();
		});

		vm.guides = ListaContratos;
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
			vm.guides = $filter('filter')(ListaContratos, { num_contrato: vm.query }, true);
		}
		vm.search = search;

		function modal(id_contrato, num_contrato, sigla_contrato) {
			vm.num_contrato = num_contrato;
			vm.id_contrato = id_contrato;
			vm.sigla_contrato = sigla_contrato;
			ContratosResource.produtosContrato().query({ id_contrato: id_contrato }).$promise.then(function (data) {
				if (data.length) {
					$('#excluir_contrato_aviso').modal('open');
				} else {
					$('#excluir_contrato').modal('open');
				}
			});
		}
		vm.modal = modal;

		function excluir(id_contrato) {
			ContratosResource.contratos().delete({ id_contrato: id_contrato }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.guides = vm.guides.filter(function (elem) {
						if (elem.id_contrato !== id_contrato) {
							return elem;
						}
					});
					M.toast({ html: 'Contrato excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaContratosCtrl.$inject = ['ListaContratos', 'ContratosResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaContratosCtrl', ListaContratosCtrl);
}());