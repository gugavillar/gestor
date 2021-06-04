(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaFornecedoresCtrl(Fornecedores, FornecedoresResource, $filter) {
		var vm = this;
		vm.fornecedores = Fornecedores;
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
			$('#excluir_fornecedor').modal();
			$('.tooltipped').tooltip();
		});

		function search() {
			Fornecedores = Fornecedores;
			vm.fornecedores = $filter('filter')(Fornecedores, vm.query, { nome_fornecedor: vm.query }, true);
		}
		vm.search = search;

		function modal(fornecedor) {
			vm.modal_data = fornecedor;
			$('#excluir_fornecedor').modal('open');
		}
		vm.modal = modal;

		function excluir(id_fornecedor) {
			FornecedoresResource.delete({ id_fornecedor: id_fornecedor }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.fornecedores = vm.fornecedores.filter(function (elem) {
						if (elem.id_fornecedor !== id_fornecedor) {
							return elem;
						}
					});
					M.toast({ html: 'Fornecedor excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaFornecedoresCtrl.$inject = ['Fornecedores', 'FornecedoresResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaFornecedoresCtrl', ListaFornecedoresCtrl);
}());