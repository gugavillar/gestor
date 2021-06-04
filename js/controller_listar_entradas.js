(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaEntradasCtrl(ListaEntradas, $filter) {
		var vm = this;
		vm.guides = ListaEntradas;
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
			$('.tooltipped').tooltip();
		});

		function search() {
			vm.guides = $filter('filter')(ListaEntradas, { num_nota_entrada: vm.query }, true);
		}
		vm.search = search;
	}
	ListaEntradasCtrl.$inject = ['ListaEntradas', '$filter'];

	angular.module('GESTOQUE').controller('ListaEntradasCtrl', ListaEntradasCtrl);
}());