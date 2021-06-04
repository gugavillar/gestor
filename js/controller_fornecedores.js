(function () {
	'use strict';
	/*global M, angular, $*/
	function FornecedoresCtrl(FornecedoresResource, $http) {
		var vm = this, copy;

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

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			FornecedoresResource.save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_fornecedor) {
					M.toast({ html: 'Fornecedor cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /CNPJ UNICO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Fornecedor já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	FornecedoresCtrl.$inject = ['FornecedoresResource', '$http'];

	angular.module('GESTOQUE').controller('FornecedoresCtrl', FornecedoresCtrl);
}());