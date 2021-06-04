(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarGuiaSaidaCtrl(GuiaSaida, ProdutosGuiaSaida, Produtos, GuiasSaidasResource, EstoqueResource) {
		var vm = this, copy;
		vm.produtosGuia = ProdutosGuiaSaida;
		vm.dados = GuiaSaida;
		vm.produtos = Produtos;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function getEstoque(id_produto) {
			EstoqueResource.produto().get({ id_produto: id_produto }).$promise.then(function (data) {
				if (!data.quantidade_entrada) {
					M.toast({ html: 'Produto sem entrada no estoque', inDuration: 2000, classes: 'rounded noprint' });
				} else {
					vm.itens.disponivel_estoque = parseInt(data.quantidade_entrada, 10) - parseInt(data.quantidade_saida, 10);
					$(document).ready(function () {
						M.updateTextFields();
					});
				}
			});
		}
		vm.getEstoque = getEstoque;

		function check() {
			if (vm.itens.quantidade_saida_itenssaida) {
				if (vm.itens.disponivel_estoque < parseInt(vm.itens.quantidade_saida_itenssaida, 10)) {
					M.toast({ html: 'Você não pode distribuir mais que o disponível', inDuration: 2000, classes: 'rounded noprint' });
					delete vm.itens.quantidade_saida_itenssaida;
				}
			} else {
				M.toast({ html: 'O Produto está com o estoque zerado', inDuration: 2000, classes: 'rounded noprint' });
				delete vm.itens.quantidade_saida_itenssaida;
			}
		}
		vm.check = check;

		function inserir() {
			vm.itens.id_saida_itenssaida = vm.dados.id_saida;
			copy = angular.copy(vm.itens);
			delete vm.itens;
			GuiasSaidasResource.itensSaida().save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_itenssaida) {
					vm.produtos.filter(function (el_produto) {
						if (el_produto.id_produto === copy.id_produto_itenssaida) {
							el_produto.disabled = true;
							$(document).ready(function () {
								$('select').formSelect();
							});
						}
					});
					GuiasSaidasResource.itensSaida().get({ id_itenssaida: data.id_itenssaida }).$promise.then(function (data) {
						vm.produtosGuia.push(data);
					});
					M.toast({ html: 'Item inserido com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
				}
			});
		}
		vm.inserir = inserir;

		function excluir(id_itenssaida, id_produto) {
			GuiasSaidasResource.itensSaida().delete({ id_itenssaida: id_itenssaida }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.produtosGuia = vm.produtosGuia.filter(function (el_produtosGuia) {
						if (el_produtosGuia.id_produto !== id_produto) {
							return el_produtosGuia;
						}
					});
					vm.produtos.filter(function (el_produtos) {
						if (el_produtos.id_produto === id_produto) {
							delete el_produtos.disabled;
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
	EditarGuiaSaidaCtrl.$inject = ['GuiaSaida', 'ProdutosGuiaSaida', 'Produtos', 'GuiasSaidasResource', 'EstoqueResource'];

	angular.module('GESTOQUE').controller('EditarGuiaSaidaCtrl', EditarGuiaSaidaCtrl);
}());