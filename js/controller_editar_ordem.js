(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarOrdemCtrl(Ordem, ProdutosOrdemFornecimento, ContratosResource, OrdensResource) {
		var vm = this, copy;
		vm.produtosOrdem = ProdutosOrdemFornecimento;
		vm.ordem = Ordem;

		$(document).ready(function () {
			ContratosResource.produtosContrato().query({ id_contrato: vm.ordem.id_contrato_ordemfornecimento }).$promise.then(function (data) {
				if (data.length) {
					vm.produtos = data;
					$(document).ready(function () {
						$('select').formSelect();
					});
				} else {
					M.toast({ html: 'Não existe produtos para o contrato escolhido', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		});


		function check() {
			if (vm.itens.saldo_produto_itensordemfornecimento) {
				if (vm.itens.saldo_produto_itensordemfornecimento < parseInt(vm.itens.quantidade_produto_itensordemfornecimento, 10)) {
					M.toast({ html: 'Você não pode pedir mais que o disponível', inDuration: 2000, classes: 'rounded noprint' });
					delete vm.itens.quantidade_produto_itensordemfornecimento;
				}
			} else {
				M.toast({ html: 'O Produto está com o saldo zerado', inDuration: 2000, classes: 'rounded noprint' });
				delete vm.itens.quantidade_produto_itensordemfornecimento;
			}
		}
		vm.check = check;

		function getSaldo(id_produto_itensordemfornecimento) {
			var id_itenscontrato;
			vm.produtos.filter(function (elem) {
				if (elem.id_produto === id_produto_itensordemfornecimento) {
					id_itenscontrato = elem.id_itenscontrato;
				}
			});
			ContratosResource.itensContrato().get({ id_itenscontrato: id_itenscontrato }).$promise.then(function (data) {
				vm.itens.saldo_produto_itensordemfornecimento = parseInt(data.saldo_produto_itenscontrato, 10) - parseInt(data.saldo_produto_emuso_itenscontrato, 10);
				vm.itens.valor_produto_itensordemfornecimento = data.valor_produto_itenscontrato;
				$(document).ready(function () {
					M.updateTextFields();
				});
			});
		}
		vm.getSaldo = getSaldo;

		function inserir() {
			vm.itens.id_ordem_itensordemfornecimento = vm.ordem.id_ordemfornecimento;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			OrdensResource.itensOrdem().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itensordemfornecimento) {
					vm.produtos.filter(function (el) {
						if (el.id_produto === copy.id_produto_itensordemfornecimento) {
							el.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					OrdensResource.itensOrdem().get({ id_itensordemfornecimento: data.id_itensordemfornecimento }).$promise.then(function (data) {
						vm.produtosOrdem.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itensordemfornecimento, id_produto) {
			OrdensResource.itensOrdem().delete({ id_itensordemfornecimento: id_itensordemfornecimento }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosOrdem = vm.produtosOrdem.filter(function (el) {
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
	EditarOrdemCtrl.$inject = ['Ordem', 'ProdutosOrdemFornecimento', 'ContratosResource', 'OrdensResource'];

	angular.module('GESTOQUE').controller('EditarOrdemCtrl', EditarOrdemCtrl);
}());