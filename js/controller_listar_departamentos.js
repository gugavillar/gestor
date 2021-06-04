(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaDepartamentosCtrl(Departamentos, DepartamentosResource, $filter) {
		var vm = this;
		vm.departamentos = Departamentos;
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
			$('#excluir_departamento').modal();
			$('.tooltipped').tooltip();
		});

		function search() {
			vm.departamentos = $filter('filter')(Departamentos, vm.query, { nome_departamento: vm.query }, true);
		}
		vm.search = search;

		function modal(departamento) {
			vm.modal_data = departamento;
			$('#excluir_departamento').modal('open');
		}
		vm.modal = modal;

		function excluir(id_departamento) {
			DepartamentosResource.delete({ id_departamento: id_departamento }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.departamentos = vm.departamentos.filter(function (elem) {
						if (elem.id_departamento !== id_departamento) {
							return elem;
						}
					});
					M.toast({ html: 'Departamento excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaDepartamentosCtrl.$inject = ['Departamentos', 'DepartamentosResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaDepartamentosCtrl', ListaDepartamentosCtrl);
}());