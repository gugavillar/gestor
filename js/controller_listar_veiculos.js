(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaVeiculosCtrl(Veiculos, VeiculosResource, $filter) {
		var vm = this;
		vm.veiculos = Veiculos;
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
			$('#excluir_veiculo').modal();
			$('.tooltipped').tooltip();
		});

		function search() {
			vm.veiculos = $filter('filter')(Veiculos, { placa_veiculo: vm.query }, true);
		}
		vm.search = search;

		function modal(veiculo) {
			vm.modal_data = veiculo;
			$('#excluir_veiculo').modal('open');
		}
		vm.modal = modal;

		function excluir(id_veiculo) {
			VeiculosResource.delete({ id_veiculo: id_veiculo }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.veiculos = vm.veiculos.filter(function (elem) {
						if (elem.id_veiculo !== id_veiculo) {
							return elem;
						}
					});
					M.toast({ html: 'Veículo excluído com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;
	}
	ListaVeiculosCtrl.$inject = ['Veiculos', 'VeiculosResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaVeiculosCtrl', ListaVeiculosCtrl);
}());