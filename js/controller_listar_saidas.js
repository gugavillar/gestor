(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaSaidasCtrl(ListaSaidas, GuiasSaidasResource, $filter) {
		var vm = this;

		$(document).ready(function () {
			$('#excluir_guia').modal();
			$('#excluir_guia_aviso').modal();
			$('.tooltipped').tooltip();
		});

		vm.guides = ListaSaidas;
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

		function excluir(id_saida) {
			GuiasSaidasResource.guias().delete({ id_saida: id_saida }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.guides = vm.guides.filter(function (elem) {
						if (elem.id_saida !== id_saida) {
							return elem;
						}
					});
					M.toast({ html: 'Guia excluída com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.excluir = excluir;

		function modal(id_saida, num_saida) {
			vm.num_saida = num_saida;
			vm.id_saida = id_saida;
			GuiasSaidasResource.produtosSaida().query({ id_saida: id_saida }).$promise.then(function (data) {
				if (data.length) {
					$('#excluir_guia_aviso').modal('open');
				} else {
					$('#excluir_guia').modal('open');
				}
			});
		}
		vm.modal = modal;

		function search() {
			vm.guides = $filter('filter')(ListaSaidas, { num_saida: vm.query }, true);
		}
		vm.search = search;
	}
	ListaSaidasCtrl.$inject = ['ListaSaidas', 'GuiasSaidasResource', '$filter'];

	angular.module('GESTOQUE').controller('ListaSaidasCtrl', ListaSaidasCtrl);
}());