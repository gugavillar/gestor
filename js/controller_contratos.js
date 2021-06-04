(function () {
	'use strict';
	/*global M, angular, $*/
	function ContratosCtrl(Fornecedores, Produtos, Upload, ProdutosResource, ContratosResource, $scope) {
		var vm = this, copy;
		vm.fornecedores = Fornecedores;
		vm.formulario = true;
		vm.produtos = Produtos;
		vm.produtosContrato = [];

		function checkData() {
			if (vm.novo) {
				if (vm.novo.fim_contrato) {
					if (vm.novo.inicio_contrato >= vm.novo.fim_contrato) {
						$('#fim_contrato').val('').focus();
						delete vm.novo.fim_contrato;
						$scope.$apply();
						M.toast({ html: 'A data final tem que ser superior a data de início', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			}
		}

		$(document).ready(function () {
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

		function uploadFile(id_contrato_anexocontrato, id_fornecedor_anexocontrato, num_contrato_anexocontrato) {
			Upload.upload({
				url: 'api/contratos/upload',
				method: 'POST',
				data: { file: vm.file, id_contrato_anexocontrato: id_contrato_anexocontrato, id_fornecedor_anexocontrato: id_fornecedor_anexocontrato, num_contrato_anexocontrato: num_contrato_anexocontrato }
			}).then(function (resp) {
				if (resp.data.id_anexocontrato) {
					M.toast({ html: 'Contrato anexado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}

		function getPrice(id_produto) {
			ProdutosResource.get({ id_produto: id_produto }).$promise.then(function (data) {
				vm.itens.valor_produto_itenscontrato = data.valor_produto;
				$(document).ready(function () {
					M.updateTextFields();
				});
			});
		}
		vm.getPrice = getPrice;

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			ContratosResource.contratos().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_contrato) {
					if (vm.file) {
						uploadFile(data.id_contrato, copy.id_fornecedor_contrato, copy.num_contrato);
					}
					M.toast({ html: 'Contrato cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
					vm.resposta = data;
					vm.formulario = false;
				} else {
					var pattern = /UNICO NUMERO DE CONTRATO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Contrato já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;

		function inserir() {
			vm.itens.id_contrato_itenscontrato = vm.resposta.id_contrato;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			ContratosResource.itensContrato().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itenscontrato) {
					vm.produtos.filter(function (el) {
						if (el.id_produto === copy.id_produto_itenscontrato) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					ContratosResource.itensContrato().get({ id_itenscontrato: data.id_itenscontrato }).$promise.then(function (data) {
						vm.produtosContrato.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itenscontrato, id_produto) {
			ContratosResource.itensContrato().delete({ id_itenscontrato: id_itenscontrato }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosContrato = vm.produtosContrato.filter(function (el) {
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
	ContratosCtrl.$inject = ['Fornecedores', 'Produtos', 'Upload', 'ProdutosResource', 'ContratosResource', '$scope'];

	angular.module('GESTOQUE').controller('ContratosCtrl', ContratosCtrl);
}());