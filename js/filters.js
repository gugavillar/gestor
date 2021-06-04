(function () {
	'use strict';
	/*global angular*/

	function tipoContrato() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
						return 'SERVIÇO';
					case '2':
						return 'FORNECIMENTO';
					case '3':
						return 'GESTÃO';
					default:
						return 'CONCESSÃO';
				}
			}
		};
	}

	function cep() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{5})(\d{3})$/g, '$1-$2');
				return input;
			}
		};
	}

	function cnpj() {
		return function (input) {
			if (input) {
				input = input.replace(/\D/g, '');
				input = input.replace(/(\d{2})(\d)/, '$1.$2');
				input = input.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
				input = input.replace(/\.(\d{3})(\d)/, '.$1/$2');
				input = input.replace(/(\d{4})(\d)/, '$1-$2');
				return input;
			}
		};
	}

	function data(dateFilter) {
		return function (input) {
			if (input) {
				var dados = input.split(' '), data, novaData;
				data = dados[0].split('-');
				novaData = new Date(data[0], data[1] - 1, data[2]);
				return dateFilter(novaData, 'dd/MM/yyyy');
			}
		};
	}
	data.$inject = ['dateFilter'];

	function recurso(ConstantService) {
		return function (input) {
			if (input) {
				var check = ConstantService.recursos.find(function (element) {
					if (element.id_recurso === parseInt(input, 10)) {
						return element.nome_recurso;
					}
				});
				return check.nome_recurso;
			}
		};
	}
	recurso.$inject = ['ConstantService'];

	function noNumber() {
		return function (input) {
			if (isNaN(input)) {
				return 0;
			} else {
				return input;
			}
		};
	}

	function Telefone() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{2})(\d{4,5})(\d{4})$/g, '($1) $2-$3');
				return input;
			}
		};
	}

	function SomaTotal() {
		return function (input, property1, property2) {
			return input.reduce(function (total, valorAtual) {
				return total + (valorAtual[property1] * valorAtual[property2]);
			}, 0);
		};
	}

	function PeriodoContrato(dateFilter) {
		return function (date1, date2) {
			if (date1 && date2) {
				return dateFilter(date1, 'dd/MM/yyyy') + ' ATÉ ' + dateFilter(date2, 'dd/MM/yyyy');
			}
		};
	}
	PeriodoContrato.$inject = ['dateFilter'];

	function ColorDate() {
		return function (input) {
			if (input) {
				if (input <= 3) {
					return 'red-text';
				} else if (input <= 6) {
					return 'orange-text accent-1';
				} else {
					return false;
				}
			}
		};
	}

	function Prioridade() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
						return 'NORMAL';
					case '2':
						return 'URGENTE';
					default:
						return 'MÁXIMA';
				}
			}
		};
	}

	function Placa() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\w{3})(\w{4})$/g, '$1-$2');
				return input;
			}
		};
	}

	function marcaVeiculo($http) {
		var isWaiting = false;
		var translations = null;
		function marcaFilter(input, tipo_veiculo) {
			var translationValue = 'Carregando...';
			if (translations) {
				$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
				translations.find(function (elem) {
					if (elem.codigo == input) {
						translationValue = elem.nome.toUpperCase();
					}
				});
			} else {
				if (isWaiting === false) {
					isWaiting = true;
					delete $http.defaults.headers.common.Authorization;
					$http.get('https://parallelum.com.br/fipe/api/v1/' + tipo_veiculo + '/marcas').then(function (data) {
						translations = data.data;
						isWaiting = false;
					});
				}
			}
			return translationValue;
		}
		marcaFilter.$stateful = true;
		return marcaFilter;
	}
	marcaVeiculo.$inject = ['$http'];

	angular.module('GESTOQUE').filter('tipoContrato', tipoContrato).filter('cep', cep).filter('cnpj', cnpj).filter('data', data).filter('recurso', recurso).filter('noNumber', noNumber).filter('Telefone', Telefone).filter('SomaTotal', SomaTotal).filter('PeriodoContrato', PeriodoContrato).filter('ColorDate', ColorDate).filter('Prioridade', Prioridade).filter('Placa', Placa).filter('marcaVeiculo', marcaVeiculo);
}());