angular.module('services').service('localDB', ['$localStorage','$q', function($localStorage, $q) {

  /* Valores padrões de cada estrutura de registro
  */
  var objDefault = {
    cursos: {nome:null},
    disciplinas: {nome:null, cursos_id:null},
    professores: {nome:null, horarios_id: []},
    turmas: {nome: null, curso_id: null},
    horarios: {dia: null, periodo: null, descricao:null},
    grades: {curso_id: null, disciplina_id: null, turma_id: null, professor_id: null, carga_horaria: null},
    quadros: {horario_id:null, grade_id:null}
  };

  /* Método que apaga os registros
  */
  this.destroy = function(_obj) {
      $localStorage[_obj]=null;
      delete $localStorage[_obj];
  }

  /* Método que retorna o valor padrão para o registro
  *
  * APESAR DO CÓDIGO NÃO TER NENHUM EVENTO ASSINCRONO, ELE FOI CONSTRUIDO
  * UTILIZANDO PROMISE PARA IMPLEMENTAÇÕES DE BANCO DE DADOS FUTURAS.
  */
  this.reset = function(_obj) {
    var deffered = $q.defer();
    if (_obj==undefined) {
      deffered.reject('Resource não definido');
    } else {
      try {
        var ret = angular.copy(objDefault[_obj]);
        deffered.resolve(ret);
      } catch (e) {
        deffered.reject(err.message);
      }
    }
    return deffered.promise;
  }

  /* Método que recupera todos os registros
  *
  * APESAR DO CÓDIGO NÃO TER NENHUM EVENTO ASSINCRONO, ELE FOI CONSTRUIDO
  * UTILIZANDO PROMISE PARA IMPLEMENTAÇÕES DE BANCO DE DADOS FUTURAS.
  */
  this.getAll = function(_obj) {
    var deffered = $q.defer();
    if (_obj==undefined) {
      deffered.reject('Resource não definido');
    } else {
      try {
        var ret = $localStorage[_obj];
        deffered.resolve(ret);
      } catch (e) {
        deffered.reject(err.message);
      }
    }
    return deffered.promise;
  }


  /* Método que recupera um registro pelo seu ID
  *
  * APESAR DO CÓDIGO NÃO TER NENHUM EVENTO ASSINCRONO, ELE FOI CONSTRUIDO
  * UTILIZANDO PROMISE PARA IMPLEMENTAÇÕES DE BANCO DE DADOS FUTURAS.
  */
  this.getById = function(_obj, _id) {
    var deffered = $q.defer();
    if (_obj==undefined) {
      deffered.reject('Resource não definido');
    } else if (_id=='' || isNaN(_id)) {
        deffered.reject('ID inválido');
    } else {
      try {
        var ret = {};
        var rows = $localStorage[_obj];
        angular.forEach(rows, function(val, index){
          if (val.id!=undefined && val.id==_id) {
            ret=val;
          }
        });
        deffered.resolve(ret);
      } catch (e) {
        deffered.reject(err.message);
      }
    }
    return deffered.promise;
  };

  this.getByKey = function(_obj, _key, _value) {
    var deffered = $q.defer();
    if (_obj==undefined) {
      deffered.reject('Resource não definido');
    } else if (_key=='' || _value=='') {
        deffered.reject('CHAVE e VALOR são parâmetros obrigatórios');
    } else {
      try {
        var ret = {};
        var rows = $localStorage[_obj];
        angular.forEach(rows, function(val, index){
          if (val[_key]!=undefined && val[_key]==_value) {
            ret=val;
          }
        });
        deffered.resolve(ret);
      } catch (err) {
        deffered.reject(err.message);
      }
    }
    return deffered.promise;
  };

  /* Método que busca o proximo ID desse objeto
  */
  this.getNewId = function(_obj) {
    if ($localStorage[_obj]==undefined) {
      $localStorage[_obj]=[];
    }
    var lastObj = $localStorage[_obj][$localStorage[_obj].length-1];
    if (lastObj==undefined || lastObj.id==undefined) {
      return 1;
    } else {
      return parseInt(lastObj.id)+1;
    }
  }

  /* Método que exclui um registro do localStorage
  *
  * APESAR DO CÓDIGO NÃO TER NENHUM EVENTO ASSINCRONO, ELE FOI CONSTRUIDO
  * UTILIZANDO PROMISE PARA IMPLEMENTAÇÕES DE BANCO DE DADOS FUTURAS.
  */
  this.delete = function(_obj, _id) {
      var deffered = $q.defer();
      if (_obj=='') {
        deffered.reject('Resource não definido');
      } else if (_id=='' || isNaN(_id)) {
          deffered.reject('ID inválido');
      } else {
        try {
          this.getById(_obj, _id).then(function(selObj){
              var indexObj = $localStorage[_obj].indexOf(selObj);
              $localStorage[_obj].splice(indexObj,1);
              deffered.resolve(true);
          },function(err){
            deffered.reject(err.message);
          });
        } catch (err) {
          deffered.reject(err.message);
        }
      }
      return deffered.promise;
  }

  /* Método que insere/autaliza um registro no localStorage
  * e retorna o registro com o ID
  *
  * APESAR DO CÓDIGO NÃO TER NENHUM EVENTO ASSINCRONO, ELE FOI CONSTRUIDO
  * UTILIZANDO PROMISE PARA IMPLEMENTAÇÕES DE BANCO DE DADOS FUTURAS.
  */
  this.save = function(_obj, _data) {
    var deffered = $q.defer();
    if (_obj=='') {
      deffered.reject('Resource não definido');
    } else {
      try {
        //VERIFICA SE É UM REGISTRO NOVO OU NÃO
        if (_data.id == undefined) {
          var newObj = angular.extend({}, _data, {id: this.getNewId(_obj)});
          $localStorage[_obj].push(newObj);
          deffered.resolve(newObj);
        } else {
          this.getById(_obj, _data.id).then(function(oldObj){
            var indexOldObj = $localStorage[_obj].indexOf(oldObj);
            var newObj = angular.extend({}, oldObj, _data);
            $localStorage[_obj][indexOldObj] = newObj;
            deffered.resolve(newObj);
          },function(err){
            deffered.reject(err.message);
          });
        }
      } catch (err) {
        deffered.reject(err.message);
      }
    }
    return deffered.promise;
  };

}]);
