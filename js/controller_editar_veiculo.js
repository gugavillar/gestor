(function () {
    'use strict';
    /*global M, angular, $*/
    function EditarVeiculoCtrl(Veiculo, VeiculosResource, $state, $http) {
        var vm = this, copy;
        vm.novo = Veiculo;

        $(document).ready(function () {
            M.updateTextFields();
            $('select').formSelect();
        });

        function reload() {
            $state.go('menu.listarveiculos');
        }

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

        function editar() {
            copy = angular.copy(vm.novo);
            delete vm.novo;
            $http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
            VeiculosResource.update({ id_veiculo: copy.id_veiculo }, copy).$promise.then(function (data) {
                if (data.$resolved && data[0] === '1') {
                    M.toast({ html: 'Veículo alterado com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
                } else {
                    M.toast({ html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint' });
                }
            });
        }
        vm.editar = editar;
    }
    EditarVeiculoCtrl.$inject = ['Veiculo', 'VeiculosResource', '$state', '$http'];

    angular.module('GESTOQUE').controller('EditarVeiculoCtrl', EditarVeiculoCtrl);
}());