(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarFornecedorCtrl(Fornecedor, FornecedoresResource, $state, $http) {
		var vm = this, copy;
		vm.novo = Fornecedor;

		$(document).ready(function () {
			M.updateTextFields();
		});

		function reload() {
			$state.go('menu.listarfornecedores');
		}

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					if (data.erro !== true) {
						var endereco = data;
						vm.novo.logradouro_fornecedor = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_fornecedor = endereco.data.bairro.toUpperCase();
						vm.novo.cidade_fornecedor = endereco.data.localidade.toUpperCase();
						vm.novo.estado_fornecedor = endereco.data.uf.toUpperCase();
						$(document).ready(function () {
							M.updateTextFields();
						});
					}
				});
			}
		}
		vm.getEndereco = getEndereco;

		function editar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			FornecedoresResource.update({ id_fornecedor: copy.id_fornecedor }, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Fornecedor alterado com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.editar = editar;
	}
	EditarFornecedorCtrl.$inject = ['Fornecedor', 'FornecedoresResource', '$state', '$http'];

	angular.module('GESTOQUE').controller('EditarFornecedorCtrl', EditarFornecedorCtrl);
}());