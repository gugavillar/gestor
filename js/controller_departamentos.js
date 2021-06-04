(function () {
	'use strict';
	/*global M, angular, $*/
	function DepartamentosCtrl(DepartamentosResource, $http) {
		var vm = this, copy;

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					if (data.erro !== true) {
						var endereco = data;
						vm.novo.logradouro_departamento = endereco.data.logradouro.toUpperCase();
						vm.novo.bairro_departamento = endereco.data.bairro.toUpperCase();
						vm.novo.cidade_departamento = endereco.data.localidade.toUpperCase();
						vm.novo.estado_departamento = endereco.data.uf.toUpperCase();
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
			DepartamentosResource.save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_departamento) {
					M.toast({ html: 'Departamento cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /DEPARTAMENTO UNICO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Departamento já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.cadastrar = cadastrar;
	}
	DepartamentosCtrl.$inject = ['DepartamentosResource', '$http'];

	angular.module('GESTOQUE').controller('DepartamentosCtrl', DepartamentosCtrl);
}());