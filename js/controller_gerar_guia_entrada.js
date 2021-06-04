(function () {
	'use strict';
	/*global M, angular, $*/
	function GerarGuiaEntradaCtrl(Fornecedores, Produtos, Upload, GuiasEntradasResource, ConstantService, ProdutosResource) {
		var vm = this, copy;
		vm.block = false;
		vm.fornecedores = Fornecedores;
		vm.produtos = Produtos;
		vm.recursos = ConstantService.recursos;
		vm.produtosNota = [];

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
				disableWeekends: true
			});
		});

		function bloqueio(bool) {
			vm.block = bool;
			$(document).ready(function () {
				$('select').formSelect();
			});
		}

		function uploadFile(id_entrada_anexoentrada, id_fonecedor_anexoentrada, num_nota_entrada_anexoentrada) {
			Upload.upload({
				url: 'api/guiasentrada/upload',
				method: 'POST',
				data: { file: vm.file, id_entrada_anexoentrada: id_entrada_anexoentrada, id_fonecedor_anexoentrada: anexo_id_fornecedor, num_nota_entrada_anexoentrada: num_nota_entrada_anexoentrada }
			}).then(function (resp) {
				if (resp.data.id_anexoentrada) {
					M.toast({ html: 'Nota fiscal anexada com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(true) });
				}
			});
		}

		function getPrice(id_produto) {
			ProdutosResource.get({ id_produto: id_produto }).$promise.then(function (data) {
				vm.itens.valor_produto_itensentrada = data.valor_produto;
				$(document).ready(function () {
					M.updateTextFields();
				});
			});
		}
		vm.getPrice = getPrice;

		function cadastrar() {
			vm.dados.id_usuario_entrada = sessionStorage.getItem('id');
			GuiasEntradasResource.guias().save(vm.dados).$promise.then(function (data) {
				if (data.$resolved && data.id_entrada) {
					vm.id_entrada_itensentrada = data.id_entrada;
					if (vm.file) {
						uploadFile(data.id_entrada, vm.dados.id_fornecedor_entrada, vm.dados.num_nota_entrada);
					}
					M.toast({ html: 'Guia de entrada aberta com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(true) });
				} else {
					delete vm.dados;
					var pattern = /UNICO FORNECEDOR POR NOTA/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Nota já cadastrada', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(false) });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint', completeCallback: bloqueio(false) });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;

		function inserir() {
			vm.itens.id_entrada_itensentrada = vm.id_entrada_itensentrada;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			GuiasEntradasResource.itensEntrada().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itensentrada) {
					vm.produtos.filter(function (el) {
						if (el.id_produto === copy.id_produto_itensentrada) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					GuiasEntradasResource.itensEntrada().get({ id_itensentrada: data.id_itensentrada }).$promise.then(function (data) {
						vm.produtosNota.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itensentrada, id_produto) {
			GuiasEntradasResource.itensEntrada().delete({ id_itensentrada: id_itensentrada }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosNota = vm.produtosNota.filter(function (el) {
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
	GerarGuiaEntradaCtrl.$inject = ['Fornecedores', 'Produtos', 'Upload', 'GuiasEntradasResource', 'ConstantService', 'ProdutosResource'];

	angular.module('GESTOQUE').controller('GerarGuiaEntradaCtrl', GerarGuiaEntradaCtrl);
}());