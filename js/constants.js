(function () {
	'use strict';
	/*global angular*/
	angular.module('GESTOQUE').constant('ConstantService', {
		recursos: [{ id_recurso: 1, nome_recurso: 'RECURSO PRÓPRIO', status_recurso: 1 }, { id_recurso: 2, nome_recurso: 'RECURSO FEDERAL', status_recurso: 1 }, { id_recurso: 3, nome_recurso: 'RECURSO MISTO', status_recurso: 1 }]
	});
}());