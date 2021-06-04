(function () {
	'use strict';
	/*global M, angular, $*/
	function VeiculosCtrl($http, VeiculosResource) {
		var vm = this, copy;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function getMarcas(tipo_veiculo) {
			if (tipo_veiculo) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://parallelum.com.br/fipe/api/v1/' + tipo_veiculo + '/marcas').then(function (data) {
					vm.marcas = data.data;
					$(document).ready(function () {
						$('select').formSelect();
					});
				});
				if (vm.modelos) {
					if (vm.modelos.length) {
						vm.modelos = [];
					}
				}
			}
		}
		vm.getMarcas = getMarcas;

		function getModelo(id_marca) {
			if (id_marca) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://parallelum.com.br/fipe/api/v1/' + vm.novo.tipo_veiculo + '/marcas/' + id_marca + '/modelos').then(function (data) {
					vm.modelos = data.data.modelos;
					$(document).ready(function () {
						$('select').formSelect();
					});
				});
			}
		}
		vm.getModelo = getModelo;

		function cadastrar() {
			copy = angular.copy(vm.novo);
			delete vm.novo;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			VeiculosResource.save(copy).$promise.then(function (data) {
				if (data.$resolved && data.id_veiculo) {
					M.toast({ html: 'Veículo cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /VEICULO UNICO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Veículo já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha', inDuration: 1500, classes: 'rounded noprint' });
					}
				}
			});
			$(document).ready(function () {
				$('select').formSelect();
			});
		}
		vm.cadastrar = cadastrar;
	}
	VeiculosCtrl.$inject = ['$http', 'VeiculosResource'];

	angular.module('GESTOQUE').controller('VeiculosCtrl', VeiculosCtrl);
}());