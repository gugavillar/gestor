(function () {
	'use strict';
	/*global angular, $*/

	function getProdutos(ProdutosResource) {
		return ProdutosResource.query().$promise;
	}
	getProdutos.$inject = ['ProdutosResource'];

	function getProdutosId(ProdutosResource, $stateParams) {
		return ProdutosResource.get({ id_produto: $stateParams.id_produto }).$promise;
	}
	getProdutosId.$inject = ['ProdutosResource', '$stateParams'];

	function getDepartamentos(DepartamentosResource) {
		return DepartamentosResource.query().$promise;
	}
	getDepartamentos.$inject = ['DepartamentosResource'];

	function getDepartamentosId(DepartamentosResource, $stateParams) {
		return DepartamentosResource.get({ id_departamento: $stateParams.id_departamento }).$promise;
	}
	getDepartamentosId.$inject = ['DepartamentosResource', '$stateParams'];

	function getFornecedores(FornecedoresResource) {
		return FornecedoresResource.query().$promise;
	}
	getFornecedores.$inject = ['FornecedoresResource'];

	function getFornecedoresId(FornecedoresResource, $stateParams) {
		return FornecedoresResource.get({ id_fornecedor: $stateParams.id_fornecedor }).$promise;
	}
	getFornecedoresId.$inject = ['FornecedoresResource', '$stateParams'];

	function getVeiculos(VeiculosResource) {
		return VeiculosResource.query().$promise;
	}
	getVeiculos.$inject = ['VeiculosResource'];

	function getVeiculosId(VeiculosResource, $stateParams) {
		return VeiculosResource.get({ id_veiculo: $stateParams.id_veiculo }).$promise;
	}
	getVeiculosId.$inject = ['VeiculosResource', '$stateParams'];

	function getListaSaidas(GuiasSaidasResource) {
		return GuiasSaidasResource.guias().query().$promise;
	}
	getListaSaidas.$inject = ['GuiasSaidasResource'];

	function getGuiaSaida(GuiasSaidasResource, $stateParams) {
		return GuiasSaidasResource.guias().get({ id_saida: $stateParams.id_saida }).$promise;
	}
	getGuiaSaida.$inject = ['GuiasSaidasResource', '$stateParams'];

	function getProdutosGuiaSaida(GuiasSaidasResource, $stateParams) {
		return GuiasSaidasResource.produtosSaida().query({ id_saida: $stateParams.id_saida }).$promise;
	}
	getProdutosGuiaSaida.$inject = ['GuiasSaidasResource', '$stateParams'];

	function getListaEntradas(GuiasEntradasResource) {
		return GuiasEntradasResource.guias().query().$promise;
	}
	getListaEntradas.$inject = ['GuiasEntradasResource'];

	function getGuiaEntrada(GuiasEntradasResource, $stateParams) {
		return GuiasEntradasResource.guias().get({ id_entrada: $stateParams.id_entrada }).$promise;
	}
	getGuiaEntrada.$inject = ['GuiasEntradasResource', '$stateParams'];

	function getProdutosGuiaEntrada(GuiasEntradasResource, $stateParams) {
		return GuiasEntradasResource.produtosEntrada().query({ id_entrada: $stateParams.id_entrada }).$promise;
	}
	getProdutosGuiaEntrada.$inject = ['GuiasEntradasResource', '$stateParams'];

	function getListaContratos(ContratosResource) {
		return ContratosResource.contratos().query().$promise;
	}
	getListaContratos.$inject = ['ContratosResource'];

	function getContrato(ContratosResource, $stateParams) {
		return ContratosResource.contratos().get({ id_contrato: $stateParams.id_contrato }).$promise;
	}
	getContrato.$inject = ['ContratosResource', '$stateParams'];

	function getProdutosContrato(ContratosResource, $stateParams) {
		return ContratosResource.produtosContrato().query({ id_contrato: $stateParams.id_contrato }).$promise;
	}
	getProdutosContrato.$inject = ['ContratosResource', '$stateParams'];

	function getListaOrdens(OrdensResource) {
		return OrdensResource.ordens().query().$promise;
	}
	getListaOrdens.$inject = ['OrdensResource'];

	function getOrdem(OrdensResource, $stateParams) {
		return OrdensResource.ordens().get({ id_ordemfornecimento: $stateParams.id_ordemfornecimento }).$promise;
	}
	getOrdem.$inject = ['OrdensResource', '$stateParams'];

	function getProdutosOrdemFornecimento(OrdensResource, $stateParams) {
		return OrdensResource.produtosOrdem().query({ id_ordemfornecimento: $stateParams.id_ordemfornecimento }).$promise;
	}
	getProdutosOrdemFornecimento.$inject = ['OrdensResource', '$stateParams'];

	function getEstoque(EstoqueResource) {
		return EstoqueResource.consulta().query().$promise;
	}
	getEstoque.$inject = ['EstoqueResource'];

	function getDashboardContratosTipos(DashboardResource) {
		return DashboardResource.tiposContrato().query().$promise;
	}
	getDashboardContratosTipos.$inject = ['DashboardResource'];

	function getDashboardContratosDiasTermino(DashboardResource) {
		return DashboardResource.terminoContrato().query().$promise;
	}
	getDashboardContratosDiasTermino.$inject = ['DashboardResource'];

	function getDashboardSaldoProdutosContrato(DashboardResource) {
		return DashboardResource.saldoContrato().query().$promise;
	}
	getDashboardSaldoProdutosContrato.$inject = ['DashboardResource'];

	function getDashboardSaldoProdutosEstoque(DashboardResource) {
		return DashboardResource.saldoEstoque().query().$promise;
	}
	getDashboardSaldoProdutosEstoque.$inject = ['DashboardResource'];

	function getProdutosQuantidades(ProdutosNotasResource) {
		return ProdutosNotasResource.query().$promise;
	}
	getProdutosQuantidades.$inject = ['ProdutosNotasResource'];

	function configuration($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'dist/partials/login.html',
				controller: 'LoginCtrl as login',
				data: {
					auth: false
				}
			})
			.state('menu', {
				url: '/menu',
				templateUrl: 'dist/partials/menu.html',
				controller: 'MenuCtrl as menu',
				abstract: true,
				data: {
					auth: true
				}
			})
			.state('menu.dashboard', {
				url: '/dashboard',
				templateUrl: 'dist/partials/dashboard.html',
				controller: 'DashboardCtrl as dashboard',
				resolve: {
					DashboardContratosTipos: getDashboardContratosTipos,
					DashboardContratosDiasTermino: getDashboardContratosDiasTermino,
					DashboardSaldoProdutosContrato: getDashboardSaldoProdutosContrato,
					DashboardSaldoProdutosEstoque: getDashboardSaldoProdutosEstoque
				},
				data: {
					auth: true
				}
			})
			.state('menu.departamentos', {
				url: '/departamentos',
				templateUrl: 'dist/partials/departamentos.html',
				controller: 'DepartamentosCtrl as departamento',
				data: {
					auth: true
				}
			})
			.state('menu.produtos', {
				url: '/produtos',
				templateUrl: 'dist/partials/produtos.html',
				controller: 'ProdutosCtrl as produto',
				data: {
					auth: true
				}
			})
			.state('menu.fornecedores', {
				url: '/fornecedores',
				templateUrl: 'dist/partials/fornecedores.html',
				controller: 'FornecedoresCtrl as fornecedor',
				data: {
					auth: true
				}
			})
			.state('menu.veiculos', {
				url: '/veiculos',
				templateUrl: 'dist/partials/veiculos.html',
				controller: 'VeiculosCtrl as veiculo',
				data: {
					auth: true
				}
			})
			.state('menu.contratos', {
				url: '/contratos',
				templateUrl: 'dist/partials/contratos.html',
				controller: 'ContratosCtrl as contrato',
				data: {
					auth: true
				},
				resolve: {
					Fornecedores: getFornecedores,
					Produtos: getProdutos
				}
			})
			.state('menu.gerarguiasaida', {
				url: '/gerarguiasaida',
				templateUrl: 'dist/partials/gerar_guia_saida.html',
				controller: 'GerarGuiaSaidaCtrl as gerar',
				resolve: {
					Departamentos: getDepartamentos,
					Produtos: getProdutos
				},
				data: {
					auth: true
				}
			})
			.state('menu.gerarguiaentrada', {
				url: '/gerarguiaentrada',
				templateUrl: 'dist/partials/gerar_guia_entrada.html',
				controller: 'GerarGuiaEntradaCtrl as gerar',
				resolve: {
					Fornecedores: getFornecedores,
					Produtos: getProdutos
				},
				data: {
					auth: true
				}
			})
			.state('menu.gerarordemfornecimento', {
				url: '/gerarordemfornecimento',
				templateUrl: 'dist/partials/gerar_ordem_fornecimento.html',
				controller: 'GerarOrdemCtrl as gerar',
				resolve: {
					Fornecedores: getFornecedores,
					Departamentos: getDepartamentos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarsaidas', {
				url: '/listarsaidas',
				templateUrl: 'dist/partials/listar_saidas.html',
				controller: 'ListaSaidasCtrl as lista',
				resolve: {
					ListaSaidas: getListaSaidas
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarentradas', {
				url: '/listarentradas',
				templateUrl: 'dist/partials/listar_entradas.html',
				controller: 'ListaEntradasCtrl as lista',
				data: {
					auth: true
				},
				resolve: {
					ListaEntradas: getListaEntradas
				}
			})
			.state('menu.listardepartamentos', {
				url: '/listardepartamentos',
				templateUrl: 'dist/partials/listar_departamentos.html',
				controller: 'ListaDepartamentosCtrl as lista',
				resolve: {
					Departamentos: getDepartamentos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarprodutos', {
				url: '/listarprodutos',
				templateUrl: 'dist/partials/listar_produtos.html',
				controller: 'ListaProdutosCtrl as lista',
				resolve: {
					Produtos: getProdutos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarfornecedores', {
				url: '/listarfornecedores',
				templateUrl: 'dist/partials/listar_fornecedores.html',
				controller: 'ListaFornecedoresCtrl as lista',
				resolve: {
					Fornecedores: getFornecedores
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarveiculos', {
				url: '/listarveiculos',
				templateUrl: 'dist/partials/listar_veiculos.html',
				controller: 'ListaVeiculosCtrl as lista',
				resolve: {
					Veiculos: getVeiculos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarcontratos', {
				url: '/listarcontratos',
				templateUrl: 'dist/partials/listar_contratos.html',
				controller: 'ListaContratosCtrl as lista',
				resolve: {
					ListaContratos: getListaContratos
				},
				data: {
					auth: true
				}
			})
			.state('menu.listarordens', {
				url: '/listarordens',
				templateUrl: 'dist/partials/listar_ordem.html',
				controller: 'ListaOrdensCtrl as lista',
				resolve: {
					ListaOrdens: getListaOrdens
				},
				data: {
					auth: true
				}
			})
			.state('menu.relatoriopordepartamento', {
				url: '/relatoriopordepartamento',
				templateUrl: 'dist/partials/relatorio_por_departamento.html',
				controller: 'RelatorioPorDepartamentoCtrl as relatorio',
				resolve: {
					Departamentos: getDepartamentos
				},
				data: {
					auth: true
				}
			})
			.state('menu.relatorioentrada', {
				url: '/relatorioentrada',
				templateUrl: 'dist/partials/relatorio_entrada.html',
				controller: 'RelatorioEntradaCtrl as relatorio',
				data: {
					auth: true
				}
			})
			.state('menu.relatorioentradafornecedor', {
				url: '/relatorioentradafornecedor',
				templateUrl: 'dist/partials/relatorio_entrada_fornecedor.html',
				controller: 'RelatorioEntradaFornecedorCtrl as relatorio',
				resolve: {
					Fornecedores: getFornecedores
				},
				data: {
					auth: true
				}
			})
			.state('menu.estoque', {
				url: '/estoque',
				templateUrl: 'dist/partials/estoque_geral.html',
				controller: 'ConsultarEstoqueCtrl as estoque',
				resolve: {
					Estoque: getEstoque
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarguiasaida', {
				url: '/editarguiasaida/:id_saida',
				templateUrl: 'dist/partials/editar_guia_saida.html',
				controller: 'EditarGuiaSaidaCtrl as editar',
				resolve: {
					GuiaSaida: getGuiaSaida,
					Produtos: getProdutos,
					ProdutosGuiaSaida: getProdutosGuiaSaida
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarguiaentrada', {
				url: '/editarguiaentrada/:id_entrada',
				templateUrl: 'dist/partials/editar_guia_entrada.html',
				controller: 'EditarGuiaEntradaCtrl as editar',
				resolve: {
					GuiaEntrada: getGuiaEntrada,
					ProdutosGuiaEntrada: getProdutosGuiaEntrada,
					Produtos: getProdutos
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarproduto', {
				url: '/editarproduto/:id_produto',
				templateUrl: 'dist/partials/editar_produto.html',
				controller: 'EditarProdutoCtrl as produto',
				resolve: {
					Produto: getProdutosId
				},
				data: {
					auth: true
				}
			})
			.state('menu.editardepartamento', {
				url: '/editardepartamento/:id_departamento',
				templateUrl: 'dist/partials/editar_departamento.html',
				controller: 'EditarDepartamentoCtrl as departamento',
				resolve: {
					Departamento: getDepartamentosId
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarfornecedor', {
				url: '/editarfornecedor/:id_fornecedor',
				templateUrl: 'dist/partials/editar_fornecedor.html',
				controller: 'EditarFornecedorCtrl as fornecedor',
				resolve: {
					Fornecedor: getFornecedoresId
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarveiculo', {
				url: '/editarveiculo/:id_veiculo',
				templateUrl: 'dist/partials/editar_veiculo.html',
				controller: 'EditarVeiculoCtrl as veiculo',
				resolve: {
					Veiculo: getVeiculosId
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarcontrato', {
				url: '/editarcontrato/:id_contrato',
				templateUrl: 'dist/partials/editar_contrato.html',
				controller: 'EditarContratoCtrl as editar',
				resolve: {
					Contrato: getContrato,
					Produtos: getProdutos,
					ProdutosContrato: getProdutosContrato
				},
				data: {
					auth: true
				}
			})
			.state('menu.editarordem', {
				url: '/editarodem/:id_ordemfornecimento',
				templateUrl: 'dist/partials/editar_ordem.html',
				controller: 'EditarOrdemCtrl as editar',
				resolve: {
					Ordem: getOrdem,
					ProdutosOrdemFornecimento: getProdutosOrdemFornecimento,
					Produtos: getProdutos
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirguiaentrada', {
				url: '/imprimirguiaentrada/:id_entrada',
				templateUrl: 'dist/partials/imprimir_guia_entrada.html',
				controller: 'ImprimirGuiaEntradaCtrl as imprimir',
				resolve: {
					GuiaEntrada: getGuiaEntrada,
					ProdutosGuiaEntrada: getProdutosGuiaEntrada
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirguiasaida', {
				url: '/imprimirguiasaida/:id_saida',
				templateUrl: 'dist/partials/imprimir_guia_saida.html',
				controller: 'ImprimirGuiaSaidaCtrl as imprimir',
				resolve: {
					GuiaSaida: getGuiaSaida,
					ProdutosGuiaSaida: getProdutosGuiaSaida
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimircontrato', {
				url: '/imprimircontrato/:id_contrato',
				templateUrl: 'dist/partials/imprimir_contrato.html',
				controller: 'ImprimirContratoCtrl as imprimir',
				resolve: {
					Contrato: getContrato,
					ProdutosContrato: getProdutosContrato
				},
				data: {
					auth: true
				}
			})
			.state('menu.imprimirordem', {
				url: '/imprimirordem/:id_ordemfornecimento',
				templateUrl: 'dist/partials/imprimir_ordem.html',
				controller: 'ImprimirOrdemCtrl as imprimir',
				resolve: {
					Ordem: getOrdem,
					ProdutosOrdemFornecimento: getProdutosOrdemFornecimento
				},
				data: {
					auth: true
				}
			});
		$urlRouterProvider.otherwise('/login');
	}
	configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

	function runner($rootScope, $state, LoginResource, cfpLoadingBar) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			cfpLoadingBar.start();
			if (toState.data.auth && !LoginResource.chkCred()) {
				cfpLoadingBar.complete();
				event.preventDefault();
				$state.go('login');
			}
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState) {
			cfpLoadingBar.complete();
		});
	}
	runner.$inject = ['$rootScope', '$state', 'LoginResource', 'cfpLoadingBar'];

	angular.module('GESTOQUE', ['ui.router', 'ngResource', 'angular-table', 'angular-loading-bar', 'ngFileUpload', 'monospaced.elastic', '720kb.tooltips']).config(configuration).run(runner);
}());