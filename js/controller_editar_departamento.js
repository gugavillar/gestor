(function () {
	'use strict';
	/*global M, angular, $*/
	function EditarDepartamentoCtrl(Departamento, DepartamentosResource, $state, $http) {
		var vm = this, copy;
		vm.novo = Departamento;

		$(document).ready(function () {
			M.updateTextFields();
		});

		function reload() {
			$state.go('menu.listardepartamentos');
		}

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

		function editar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			DepartamentosResource.update({ id_departamento: copy.id_departamento }, copy).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Departamento alterado com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.editar = editar;
	}
	EditarDepartamentoCtrl.$inject = ['Departamento', 'DepartamentosResource', '$state', '$http'];

	angular.module('GESTOQUE').controller('EditarDepartamentoCtrl', EditarDepartamentoCtrl);
}());