(function () {
	'use strict';
	/*global M, angular, $*/
	function RelatorioEntradaCtrl(ConstantService, RelatoriosResource, $scope) {
		var vm = this;
		vm.recursos = ConstantService.recursos;

		function checkData() {
			if (vm.dados) {
				if (vm.dados.fim_periodo) {
					if (vm.dados.inicio_periodo >= vm.dados.fim_periodo) {
						$('#fim').val('').focus();
						delete vm.dados.fim_periodo;
						$scope.$apply();
						M.toast({ html: 'A data final tem que ser superior a data de início', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			}
		}

		$(document).ready(function () {
			$('#resposta').modal();
			$('select').formSelect();
			$('.datepicker').datepicker({
				i18n: {
					months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
					weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
					weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
					weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
					today: 'Hoje',
					clear: 'Limpar',
					cancel: 'Sair',
					done: 'Ok',
					labelMonthNext: 'Próximo mês',
					labelMonthPrev: 'Mês anterior',
					labelMonthSelect: 'Selecione um mês',
					labelYearSelect: 'Selecione um ano'
				},
				format: 'dd/mm/yyyy',
				disableWeekends: true,
				onClose: function () {
					checkData();
				}
			});
		});

		function clean() {
			for (var prop in vm.dados) {
				if (prop !== 'id_recurso') {
					delete vm.dados[prop];
				}
			}
			delete vm.produtos;
		}
		vm.clean = clean;

		function gerar() {
			RelatoriosResource.entradas().query({ id_recurso: vm.dados.id_recurso, inicio_periodo: vm.dados.inicio_periodo, fim_periodo: vm.dados.fim_periodo }).$promise.then(function (data) {
				if (data.$resolved && data.length >= 1) {
					vm.produtos = data;
					ConstantService.recursos.filter(function (elem) {
						if (elem.id_recurso === vm.dados.id_recurso) {
							vm.dados.nome_recurso = elem.nome_recurso;
						}
					});
				} else {
					$('#resposta').modal('open');
				}
			});
		}
		vm.gerar = gerar;
	}
	RelatorioEntradaCtrl.$inject = ['ConstantService', 'RelatoriosResource', '$scope'];

	angular.module('GESTOQUE').controller('RelatorioEntradaCtrl', RelatorioEntradaCtrl);
}());