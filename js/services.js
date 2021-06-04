(function () {
	'use strict';
	/*global angular*/

	function LoginResource($resource) {
		function setCred() {
			return $resource('api/login', null, {
				update: { method: 'PUT' }
			});
		}

		function chkCred() {
			var returnVal = false;
			if (sessionStorage.getItem('token')) {
				returnVal = true;
			}
			return returnVal;
		}

		function delCred() {
			sessionStorage.clear();
		}

		return {
			setCred: setCred,
			chkCred: chkCred,
			delCred: delCred
		};
	}
	LoginResource.$inject = ['$resource'];

	function DepartamentosResource($resource) {
		return $resource('api/departamentos/:id_departamento', null, {
			update: { method: 'PUT' }
		});
	}
	DepartamentosResource.$inject = ['$resource'];

	function ProdutosResource($resource) {
		return $resource('api/produtos/:id_produto', null, {
			update: { method: 'PUT' }
		});
	}
	ProdutosResource.$inject = ['$resource'];

	function FornecedoresResource($resource) {
		return $resource('api/fornecedores/:id_fornecedor', null, {
			update: { method: 'PUT' }
		});
	}
	FornecedoresResource.$inject = ['$resource'];

	function VeiculosResource($resource) {
		return $resource('api/veiculos/:id_veiculo', null, {
			update: { method: 'PUT' }
		});
	}
	VeiculosResource.$inject = ['$resource'];

	function ContratosResource($resource) {
		function contratos() {
			return $resource('api/contratos/:id_contrato');
		}
		function produtosContrato() {
			return $resource('api/contratos/produtos/:id_contrato');
		}
		function itensContrato() {
			return $resource('api/contratos/itens/:id_itenscontrato');
		}
		function fornecedorContrato() {
			return $resource('api/contratos/fornecedor/:id_fornecedor_contrato');
		}
		function fileContrato() {
			return $resource('api/contratos/file/:id_contrato_anexocontrato');
		}

		return {
			contratos: contratos,
			produtosContrato: produtosContrato,
			itensContrato: itensContrato,
			fornecedorContrato: fornecedorContrato,
			fileContrato: fileContrato
		};
	}
	ContratosResource.$inject = ['$resource'];

	function GuiasSaidasResource($resource) {
		function guias() {
			return $resource('api/guiassaida/:id_saida');
		}
		function itensSaida() {
			return $resource('api/guiassaida/itens/:id_itenssaida');
		}
		function produtosSaida() {
			return $resource('api/guiassaida/produtos/:id_saida');
		}

		return {
			guias: guias,
			itensSaida: itensSaida,
			produtosSaida: produtosSaida
		};
	}
	GuiasSaidasResource.$inject = ['$resource'];

	function GuiasEntradasResource($resource) {
		function guias() {
			return $resource('api/guiasentrada/:id_entrada');
		}
		function itensEntrada() {
			return $resource('api/guiasentrada/itens/:id_itensentrada');
		}
		function produtosEntrada() {
			return $resource('api/guiasentrada/produtos/:id_entrada');
		}
		function fileEntrada() {
			return $resource('api/guiasentrada/file/:id_entrada_anexoentrada');
		}

		return {
			guias: guias,
			itensEntrada: itensEntrada,
			produtosEntrada: produtosEntrada,
			fileEntrada: fileEntrada
		};
	}
	GuiasEntradasResource.$inject = ['$resource'];

	function OrdensResource($resource) {
		function ordens() {
			return $resource('api/ordemfornecimento/:id_ordemfornecimento');
		}
		function itensOrdem() {
			return $resource('api/ordemfornecimento/itens/:id_itensordemfornecimento');
		}
		function produtosOrdem() {
			return $resource('api/ordemfornecimento/produtos/:id_ordemfornecimento');
		}

		return {
			ordens: ordens,
			itensOrdem: itensOrdem,
			produtosOrdem: produtosOrdem
		};
	}
	OrdensResource.$inject = ['$resource'];

	function RelatoriosResource($resource) {
		function departamentos() {
			return $resource('api/relatorios/departamentos/:id_departamento/:inicio_periodo/:fim_periodo');
		}
		function entradas() {
			return $resource('api/relatorios/entradas/:id_recurso/:inicio_periodo/:fim_periodo');
		}
		function fornecedores() {
			return $resource('api/relatorios/fornecedores/:id_fornecedor/:id_recurso/:inicio_periodo/:fim_periodo');
		}

		return {
			departamentos: departamentos,
			entradas: entradas,
			fornecedores: fornecedores
		};
	}
	RelatoriosResource.$inject = ['$resource'];

	function EstoqueResource($resource) {
		function consulta() {
			return $resource('api/estoque/consulta');
		}
		function produto() {
			return $resource('api/estoque/produto/:id_produto');
		}

		return {
			consulta: consulta,
			produto: produto
		};
	}
	EstoqueResource.$inject = ['$resource'];

	function DashboardResource($resource) {
		function tiposContrato() {
			return $resource('api/dashboard/contratos/tipos');
		}
		function terminoContrato() {
			return $resource('api/dashboard/contratos/dias/termino');
		}
		function saldoContrato() {
			return $resource('api/dashboard/saldo/produtos/contratos');
		}
		function saldoEstoque() {
			return $resource('api/dashboard/saldo/produtos/estoque');
		}

		return {
			tiposContrato: tiposContrato,
			terminoContrato: terminoContrato,
			saldoContrato: saldoContrato,
			saldoEstoque: saldoEstoque
		};
	}
	DashboardResource.$inject = ['$resource'];

	angular.module('GESTOQUE').factory('LoginResource', LoginResource).factory('DepartamentosResource', DepartamentosResource).factory('ProdutosResource', ProdutosResource).factory('FornecedoresResource', FornecedoresResource).factory('VeiculosResource', VeiculosResource).factory('ContratosResource', ContratosResource).factory('GuiasSaidasResource', GuiasSaidasResource).factory('GuiasEntradasResource', GuiasEntradasResource).factory('OrdensResource', OrdensResource).factory('RelatoriosResource', RelatoriosResource).factory('EstoqueResource', EstoqueResource).factory('DashboardResource', DashboardResource);
}());