<?php
date_default_timezone_set('America/Recife');

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once 'vendor/autoload.php';
require_once 'conection_server.php';

$verify = function (Request $request, Response $response, $next) {
	if ($request->hasHeader('Authorization')) {
		$headerValue = $request->getHeaderLine('Authorization');
		$sql = 'SELECT users.token FROM users WHERE users.token = :token';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $headerValue, PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			if ($resp) {
				$response = $next($request, $response);
			} else {
				$response = $response->withStatus(401);
				$erro['erro'] = 'Unauthorized';
				$response->getBody()->write(json_encode($erro));
			}
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	} else {
		$response = $response->withStatus(401);
		$erro['erro'] = 'Unauthorized';
		$response->getBody()->write(json_encode($erro));
	}
	return $response;
};

$app = new \Slim\App();
$app->group('/login', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'SELECT users.id, users.token, users.flag FROM users WHERE users.user = BINARY :usuario AND users.pass = BINARY :password';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('usuario', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('password', $data['pass'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE users SET users.pass = :novasenha, users.token = :token, users.flag = :flag WHERE users.id = :id';
		$data['token'] = md5($data['user'] . ':' . $data['novasenha'] . time());
		$data['flag'] = 1;
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('novasenha', $data['novasenha'], PDO::PARAM_STR);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('flag', $data['flag'], PDO::PARAM_INT);
			$stmt->bindParam('id', $data['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
});

$app->group('/produtos', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM produtos WHERE produtos.status_produto = 1 ORDER BY produtos.descricao_produto ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_produto}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM produtos WHERE produtos.id_produto = :id_produto';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_produto', $arguments['id_produto'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO produtos (produtos.descricao_produto, produtos.fabricante_produto, produtos.localizacao_produto, produtos.unidade_produto, produtos.valor_produto, produtos.estoque_minimo_produto) VALUES (:descricao_produto, :fabricante_produto, :localizacao_produto, :unidade_produto, :valor_produto, :estoque_minimo_produto)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('descricao_produto', $data['descricao_produto'], PDO::PARAM_STR);
			$stmt->bindParam('fabricante_produto', $data['fabricante_produto'], PDO::PARAM_STR);
			$stmt->bindParam('localizacao_produto', $data['localizacao_produto'], PDO::PARAM_STR);
			$stmt->bindParam('unidade_produto', $data['unidade_produto'], PDO::PARAM_STR);
			$stmt->bindParam('valor_produto', $data['valor_produto']);
			$stmt->bindParam('estoque_minimo_produto', $data['estoque_minimo_produto'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_produto'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_produto}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE produtos SET produtos.status_produto = 0 WHERE produtos.id_produto = :id_produto';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_produto', $arguments['id_produto'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id_produto}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE produtos SET produtos.descricao_produto = :descricao_produto, produtos.fabricante_produto = :fabricante_produto, produtos.localizacao_produto = :localizacao_produto, produtos.unidade_produto = :unidade_produto, produtos.valor_produto = :valor_produto, produtos.estoque_minimo_produto = :estoque_minimo_produto WHERE produtos.id_produto = :id_produto';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('descricao_produto', $data['descricao_produto'], PDO::PARAM_STR);
			$stmt->bindParam('fabricante_produto', $data['fabricante_produto'], PDO::PARAM_STR);
			$stmt->bindParam('localizacao_produto', $data['localizacao_produto'], PDO::PARAM_STR);
			$stmt->bindParam('unidade_produto', $data['unidade_produto'], PDO::PARAM_STR);
			$stmt->bindParam('valor_produto', $data['valor_produto']);
			$stmt->bindParam('estoque_minimo_produto', $data['estoque_minimo_produto'], PDO::PARAM_INT);
			$stmt->bindParam('id_produto', $arguments['id_produto'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/departamentos', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM departamentos WHERE departamentos.status_departamento = 1 ORDER BY departamentos.nome_departamento ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_departamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM departamentos WHERE departamentos.id_departamento = :id_departamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_departamento', $arguments['id_departamento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO departamentos (departamentos.nome_departamento, departamentos.responsavel_departamento, departamentos.tel_responsavel_departamento, departamentos.cep_departamento, departamentos.cidade_departamento, departamentos.estado_departamento, departamentos.logradouro_departamento, departamentos.numero_departamento, departamentos.bairro_departamento, departamentos.complemento_departamento, departamentos.referencia_departamento) VALUES (:nome_departamento, :responsavel_departamento, :tel_responsavel_departamento, :cep_departamento, :cidade_departamento, :estado_departamento, :logradouro_departamento, :numero_departamento, :bairro_departamento, :complemento_departamento, :referencia_departamento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_departamento', $data['nome_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('responsavel_departamento', $data['responsavel_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('tel_responsavel_departamento', $data['tel_responsavel_departamento'], PDO::PARAM_INT);
			$stmt->bindParam('cep_departamento', $data['cep_departamento'], PDO::PARAM_INT);
			$stmt->bindParam('cidade_departamento', $data['cidade_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('estado_departamento', $data['estado_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_departamento', $data['logradouro_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('numero_departamento', $data['numero_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_departamento', $data['bairro_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_departamento', $data['complemento_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('referencia_departamento', $data['referencia_departamento'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_departamento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_departamento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE departamentos SET departamentos.status_departamento = 0 WHERE departamentos.id_departamento = :id_departamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_departamento', $arguments['id_departamento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id_departamento}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE departamentos SET departamentos.nome_departamento = :nome_departamento, departamentos.responsavel_departamento = :responsavel_departamento, departamentos.tel_responsavel_departamento = :tel_responsavel_departamento, departamentos.cep_departamento = :cep_departamento, departamentos.cidade_departamento = :cidade_departamento, departamentos.estado_departamento = :estado_departamento, departamentos.logradouro_departamento = :logradouro_departamento, departamentos.numero_departamento = :numero_departamento, departamentos.bairro_departamento = :bairro_departamento, departamentos.complemento_departamento = :complemento_departamento, departamentos.referencia_departamento = :referencia_departamento WHERE departamentos.id_departamento = :id_departamento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_departamento', $data['nome_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('responsavel_departamento', $data['responsavel_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('tel_responsavel_departamento', $data['tel_responsavel_departamento'], PDO::PARAM_INT);
			$stmt->bindParam('cep_departamento', $data['cep_departamento'], PDO::PARAM_INT);
			$stmt->bindParam('cidade_departamento', $data['cidade_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('estado_departamento', $data['estado_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_departamento', $data['logradouro_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('numero_departamento', $data['numero_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_departamento', $data['bairro_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_departamento', $data['complemento_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('referencia_departamento', $data['referencia_departamento'], PDO::PARAM_STR);
			$stmt->bindParam('id_departamento', $arguments['id_departamento'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/fornecedores', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM fornecedores WHERE fornecedores.status_fornecedor = 1 ORDER BY fornecedores.nome_fornecedor ASC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_fornecedor}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM fornecedores WHERE fornecedores.id_fornecedor = :id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO fornecedores (fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.contato_fornecedor, fornecedores.email_fornecedor, fornecedores.cep_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.bairro_fornecedor, fornecedores.complemento_fornecedor) VALUES (:cnpj_fornecedor, :nome_fornecedor, :contato_fornecedor, :email_fornecedor, :cep_fornecedor, :cidade_fornecedor, :estado_fornecedor, :logradouro_fornecedor, :numero_fornecedor, :bairro_fornecedor, :complemento_fornecedor)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cnpj_fornecedor', $data['cnpj_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('nome_fornecedor', $data['nome_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('contato_fornecedor', $data['contato_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('email_fornecedor', $data['email_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('cep_fornecedor', $data['cep_fornecedor'], PDO::PARAM_INT);
			$stmt->bindParam('cidade_fornecedor', $data['cidade_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('estado_fornecedor', $data['estado_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_fornecedor', $data['logradouro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('numero_fornecedor', $data['numero_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_fornecedor', $data['bairro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_fornecedor', $data['complemento_fornecedor'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_fornecedor'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_fornecedor}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE fornecedores SET fornecedores.status_fornecedor = 0 WHERE fornecedores.id_fornecedor = :id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id_fornecedor}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE fornecedores SET fornecedores.cnpj_fornecedor = :cnpj_fornecedor, fornecedores.nome_fornecedor = :nome_fornecedor, fornecedores.contato_fornecedor = :contato_fornecedor, fornecedores.email_fornecedor = :email_fornecedor, fornecedores.cep_fornecedor = :cep_fornecedor, fornecedores.cidade_fornecedor = :cidade_fornecedor, fornecedores.estado_fornecedor = :estado_fornecedor, fornecedores.logradouro_fornecedor = :logradouro_fornecedor, fornecedores.numero_fornecedor = :numero_fornecedor, fornecedores.bairro_fornecedor = :bairro_fornecedor, fornecedores.complemento_fornecedor = :complemento_fornecedor WHERE fornecedores.id_fornecedor = :id_fornecedor';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cnpj_fornecedor', $data['cnpj_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('nome_fornecedor', $data['nome_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('contato_fornecedor', $data['contato_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('email_fornecedor', $data['email_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('cep_fornecedor', $data['cep_fornecedor'], PDO::PARAM_INT);
			$stmt->bindParam('cidade_fornecedor', $data['cidade_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('estado_fornecedor', $data['estado_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_fornecedor', $data['logradouro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('numero_fornecedor', $data['numero_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_fornecedor', $data['bairro_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_fornecedor', $data['complemento_fornecedor'], PDO::PARAM_STR);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/veiculos', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM veiculos WHERE veiculos.status_veiculo = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_veiculo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM veiculos WHERE veiculos.id_veiculo = :id_veiculo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_veiculo', $arguments['id_veiculo'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO veiculos (veiculos.tipo_veiculo, veiculos.marca_veiculo, veiculos.modelo_veiculo, veiculos.placa_veiculo, veiculos.renavam_veiculo, veiculos.ano_fabricacao_veiculo, veiculos.ano_modelo_veiculo, veiculos.combustivel_veiculo, veiculos.cor_veiculo, veiculos.situacao_veiculo, veiculos.tipo_frota_veiculo) VALUES (:tipo_veiculo, :marca_veiculo, :modelo_veiculo, :placa_veiculo, :renavam_veiculo, :ano_fabricacao_veiculo, :ano_modelo_veiculo, :combustivel_veiculo, :cor_veiculo, :situacao_veiculo, :tipo_frota_veiculo)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('tipo_veiculo', $data['tipo_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('marca_veiculo', $data['marca_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('modelo_veiculo', $data['modelo_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('placa_veiculo', $data['placa_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('renavam_veiculo', $data['renavam_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('ano_fabricacao_veiculo', $data['ano_fabricacao_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('ano_modelo_veiculo', $data['ano_modelo_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('combustivel_veiculo', $data['combustivel_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('cor_veiculo', $data['cor_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('situacao_veiculo', $data['situacao_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('tipo_frota_veiculo', $data['tipo_frota_veiculo'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_veiculo'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_veiculo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE veiculos SET veiculos.status_veiculo = 0 WHERE veiculos.id_veiculo = :id_veiculo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_veiculo', $arguments['id_veiculo'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id_veiculo}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE veiculos SET veiculos.tipo_veiculo = :tipo_veiculo, veiculos.marca_veiculo = :marca_veiculo, veiculos.modelo_veiculo = :modelo_veiculo, veiculos.placa_veiculo = :placa_veiculo, veiculos.renavam_veiculo = :renavam_veiculo, veiculos.ano_fabricacao_veiculo = :ano_fabricacao_veiculo, veiculos.ano_modelo_veiculo = :ano_modelo_veiculo, veiculos.combustivel_veiculo = :combustivel_veiculo, veiculos.cor_veiculo = :cor_veiculo, veiculos.situacao_veiculo = :situacao_veiculo, veiculos.tipo_frota_veiculo = :tipo_frota_veiculo WHERE veiculos.id_veiculo = :id_veiculo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('tipo_veiculo', $data['tipo_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('marca_veiculo', $data['marca_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('modelo_veiculo', $data['modelo_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('placa_veiculo', $data['placa_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('renavam_veiculo', $data['renavam_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('ano_fabricacao_veiculo', $data['ano_fabricacao_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('ano_modelo_veiculo', $data['ano_modelo_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('combustivel_veiculo', $data['combustivel_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('cor_veiculo', $data['cor_veiculo'], PDO::PARAM_STR);
			$stmt->bindParam('situacao_veiculo', $data['situacao_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('tipo_frota_veiculo', $data['tipo_frota_veiculo'], PDO::PARAM_INT);
			$stmt->bindParam('id_veiculo', $arguments['id_veiculo'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/contratos', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = "SELECT contratos.id_contrato, contratos.tipo_contrato, contratos.sigla_contrato, contratos.num_contrato, contratos.inicio_contrato, contratos.fim_contrato, fornecedores.nome_fornecedor, TIMESTAMPDIFF(MONTH, NOW(), contratos.fim_contrato) AS meses_fim FROM contratos INNER JOIN fornecedores ON contratos.id_fornecedor_contrato = fornecedores.id_fornecedor ORDER BY contratos.num_contrato ASC";
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_contrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT contratos.id_contrato, contratos.tipo_contrato, contratos.sigla_contrato, contratos.num_contrato, contratos.inicio_contrato, contratos.fim_contrato, contratos.objeto_contrato, fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.contato_fornecedor, fornecedores.email_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.cep_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor, fornecedores.bairro_fornecedor, fornecedores.complemento_fornecedor FROM contratos INNER JOIN fornecedores ON contratos.id_fornecedor_contrato = fornecedores.id_fornecedor WHERE contratos.id_contrato = :id_contrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_contrato', $arguments['id_contrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO contratos (contratos.tipo_contrato, contratos.id_fornecedor_contrato, contratos.sigla_contrato, contratos.num_contrato, contratos.inicio_contrato, contratos.fim_contrato, contratos.objeto_contrato) VALUES (:tipo_contrato, :id_fornecedor_contrato, :sigla_contrato, :num_contrato, :inicio_contrato, :fim_contrato, :objeto_contrato)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('tipo_contrato', $data['tipo_contrato'], PDO::PARAM_INT);
			$stmt->bindParam('id_fornecedor_contrato', $data['id_fornecedor_contrato'], PDO::PARAM_INT);
			$stmt->bindParam('sigla_contrato', $data['sigla_contrato'], PDO::PARAM_STR);
			$stmt->bindParam('num_contrato', $data['num_contrato'], PDO::PARAM_STR);
			$stmt->bindParam('inicio_contrato', $data['inicio_contrato']);
			$stmt->bindParam('fim_contrato', $data['fim_contrato']);
			$stmt->bindParam('objeto_contrato', $data['objeto_contrato'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_contrato'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_contrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM contratos WHERE contratos.id_contrato = :id_contrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_contrato', $arguments['id_contrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/file/{id_contrato_anexocontrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT contratos_anexos_contrato.local_anexocontrato FROM contratos_anexos_contrato WHERE contratos_anexos_contrato.id_contrato_anexocontrato = :id_contrato_anexocontrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_contrato_anexocontrato', $arguments['id_contrato_anexocontrato'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/upload', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$filename = $_FILES['file']['name'];
		$ext = pathinfo($filename, PATHINFO_EXTENSION);
		$sql = 'INSERT INTO contratos_anexos_contrato (contratos_anexos_contrato.id_contrato_anexocontrato, contratos_anexos_contrato.id_fornecedor_anexocontrato, contratos_anexos_contrato.num_contrato_anexocontrato, contratos_anexos_contrato.local_anexocontrato) VALUES (:id_contrato_anexocontrato, :id_fornecedor_anexocontrato, :num_contrato_anexocontrato, :file)';
		$filename = $data['id_contrato_anexocontrato'] . '_' . preg_replace('/\//', '_', $data['num_contrato_anexocontrato']);;
		if (move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . '/media/contratos/' . $filename . '.' . $ext)) {
			$data['file'] =  $filename . '.' . $ext;
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam('id_contrato_anexocontrato', $data['id_contrato_anexocontrato'], PDO::PARAM_INT);
				$stmt->bindParam('id_fornecedor_anexocontrato', $data['id_fornecedor_anexocontrato'], PDO::PARAM_INT);
				$stmt->bindParam('num_contrato_anexocontrato', $data['num_contrato_anexocontrato'], PDO::PARAM_STR);
				$stmt->bindParam('file', $data['file'], PDO::PARAM_STR);
				$stmt->execute();
				$data['id_anexocontrato'] = $db->lastInsertId();
				$db = null;
				$response->getBody()->write(json_encode($data));
			} catch (PDOException $e) {
				$response->getBody()->write(json_encode($e->getMessage()));
			}
		}
	});

	$app->get('/produtos/{id_contrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, contratos_itens_contrato.saldo_produto_itenscontrato, contratos_itens_contrato.saldo_produto_emuso_itenscontrato, contratos_itens_contrato.valor_produto_itenscontrato, contratos_itens_contrato.id_itenscontrato FROM produtos INNER JOIN contratos_itens_contrato ON produtos.id_produto = contratos_itens_contrato.id_produto_itenscontrato WHERE contratos_itens_contrato.id_contrato_itenscontrato = :id_contrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_contrato', $arguments['id_contrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itenscontrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, produtos.fabricante_produto, contratos_itens_contrato.valor_produto_itenscontrato, contratos_itens_contrato.saldo_produto_itenscontrato, contratos_itens_contrato.saldo_produto_emuso_itenscontrato, contratos_itens_contrato.id_itenscontrato FROM produtos INNER JOIN contratos_itens_contrato ON produtos.id_produto = contratos_itens_contrato.id_produto_itenscontrato WHERE contratos_itens_contrato.id_itenscontrato = :id_itenscontrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenscontrato', $arguments['id_itenscontrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itenscontrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM contratos_itens_contrato WHERE contratos_itens_contrato.id_itenscontrato = :id_itenscontrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenscontrato', $arguments['id_itenscontrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO contratos_itens_contrato (contratos_itens_contrato.id_contrato_itenscontrato, contratos_itens_contrato.id_produto_itenscontrato, contratos_itens_contrato.valor_produto_itenscontrato, contratos_itens_contrato.saldo_produto_itenscontrato) VALUES (:id_contrato_itenscontrato, :id_produto_itenscontrato, :valor_produto_itenscontrato, :saldo_produto_itenscontrato)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_contrato_itenscontrato', $data['id_contrato_itenscontrato'], PDO::PARAM_INT);
			$stmt->bindParam('id_produto_itenscontrato', $data['id_produto_itenscontrato'], PDO::PARAM_INT);
			$stmt->bindParam('valor_produto_itenscontrato', $data['valor_produto_itenscontrato']);
			$stmt->bindParam('saldo_produto_itenscontrato', $data['saldo_produto_itenscontrato'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_itenscontrato'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/fornecedor/{id_fornecedor_contrato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT contratos.id_contrato, contratos.tipo_contrato, contratos.sigla_contrato, contratos.num_contrato, contratos.objeto_contrato FROM contratos WHERE contratos.fim_contrato >= NOW() AND contratos.id_fornecedor_contrato = :id_fornecedor_contrato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor_contrato', $arguments['id_fornecedor_contrato'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/guiassaida', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT saidas.id_saida, saidas.num_saida, departamentos.nome_departamento, saidas.data_saida, saidas.oficio_saida, users.name FROM saidas INNER JOIN departamentos ON saidas.id_departamento_saida = departamentos.id_departamento INNER JOIN users ON users.id = saidas.id_usuario_saida ORDER BY saidas.data_saida DESC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT saidas.id_saida, saidas.num_saida, saidas.data_saida, saidas.oficio_saida, departamentos.nome_departamento, departamentos.responsavel_departamento, departamentos.numero_departamento, departamentos.cep_departamento, departamentos.logradouro_departamento, departamentos.bairro_departamento, departamentos.cidade_departamento, departamentos.estado_departamento, departamentos.complemento_departamento, departamentos.referencia_departamento, users.name FROM saidas INNER JOIN departamentos ON saidas.id_departamento_saida = departamentos.id_departamento INNER JOIN users ON saidas.id_usuario_saida = users.id WHERE saidas.id_saida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM saidas WHERE saidas.id_saida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO saidas (saidas.data_saida, saidas.id_departamento_saida, saidas.oficio_saida, saidas.id_usuario_saida) VALUES (CURRENT_DATE(), :id_departamento_saida, :oficio_saida, :id_usuario_saida)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_departamento_saida', $data['id_departamento_saida'], PDO::PARAM_INT);
			$stmt->bindParam('oficio_saida', $data['oficio_saida'], PDO::PARAM_STR);
			$stmt->bindParam('id_usuario_saida', $data['id_usuario_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_saida'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/produtos/{id_saida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, saidas_itens_saida.quantidade_saida_itenssaida, saidas_itens_saida.id_itenssaida FROM produtos INNER JOIN saidas_itens_saida ON produtos.id_produto = saidas_itens_saida.id_produto_itenssaida WHERE saidas_itens_saida.id_saida_itenssaida = :id_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_saida', $arguments['id_saida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itenssaida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, saidas_itens_saida.quantidade_saida_itenssaida, saidas_itens_saida.id_itenssaida FROM produtos INNER JOIN saidas_itens_saida ON produtos.id_produto = saidas_itens_saida.id_produto_itenssaida WHERE saidas_itens_saida.id_itenssaida = :id_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenssaida', $arguments['id_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itenssaida}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM saidas_itens_saida WHERE saidas_itens_saida.id_itenssaida = :id_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itenssaida', $arguments['id_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO saidas_itens_saida (saidas_itens_saida.id_produto_itenssaida, saidas_itens_saida.id_saida_itenssaida, saidas_itens_saida.quantidade_saida_itenssaida) VALUES (:id_produto_itenssaida, :id_saida_itenssaida, :quantidade_saida_itenssaida)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_produto_itenssaida', $data['id_produto_itenssaida'], PDO::PARAM_INT);
			$stmt->bindParam('id_saida_itenssaida', $data['id_saida_itenssaida'], PDO::PARAM_INT);
			$stmt->bindParam('quantidade_saida_itenssaida', $data['quantidade_saida_itenssaida'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_itenssaida'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/guiasentrada', function () use ($app) {
	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas.id_entrada, entradas.num_entrada, entradas.num_nota_entrada, fornecedores.nome_fornecedor, entradas.data_emissao_nota_entrada, entradas.data_entrada, entradas.id_recurso_entrada FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor ORDER BY entradas.id_entrada DESC';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/{id_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas.id_entrada, entradas.num_entrada, entradas.num_nota_entrada, entradas.data_emissao_nota_entrada, entradas.data_entrada, fornecedores.cnpj_fornecedor, fornecedores.nome_fornecedor, fornecedores.contato_fornecedor, fornecedores.email_fornecedor, fornecedores.cep_fornecedor, fornecedores.cidade_fornecedor, fornecedores.estado_fornecedor, fornecedores.logradouro_fornecedor, fornecedores.numero_fornecedor, fornecedores.bairro_fornecedor, fornecedores.complemento_fornecedor, users.name FROM entradas INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor INNER JOIN users ON entradas.id_usuario_entrada = users.id WHERE entradas.id_entrada = :id_entrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada', $arguments['id_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO entradas (entradas.num_nota_entrada, entradas.data_emissao_nota_entrada, entradas.data_entrada, entradas.id_fornecedor_entrada, entradas.id_recurso_entrada, entradas.id_usuario_entrada) VALUES (:num_nota_entrada, :data_emissao_nota_entrada, CURRENT_DATE(), :id_fornecedor_entrada, :id_recurso_entrada, :id_usuario_entrada)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('num_nota_entrada', $data['num_nota_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('data_emissao_nota_entrada', $data['data_emissao_nota_entrada']);
			$stmt->bindParam('id_fornecedor_entrada', $data['id_fornecedor_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('id_recurso_entrada', $data['id_recurso_entrada'], PDO::PARAM_INT);
			$stmt->bindParam('id_usuario_entrada', $data['id_usuario_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_entrada'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('/produtos/{id_entrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.valor_produto_itensentrada, entradas_itens_entrada.validade_produto_itensentrada, entradas_itens_entrada.id_itensentrada FROM produtos INNER JOIN entradas_itens_entrada ON produtos.id_produto = entradas_itens_entrada.id_produto_itensentrada WHERE entradas_itens_entrada.id_entrada_itensentrada = :id_entrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada', $arguments['id_entrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itensentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.valor_produto_itensentrada, entradas_itens_entrada.validade_produto_itensentrada, entradas_itens_entrada.id_itensentrada FROM produtos INNER JOIN entradas_itens_entrada ON produtos.id_produto = entradas_itens_entrada.id_produto_itensentrada WHERE entradas_itens_entrada.id_itensentrada = :id_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensentrada', $arguments['id_itensentrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itensentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_itensentrada = :id_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensentrada', $arguments['id_itensentrada'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		if (isset($data['validade_produto_itensentrada'])) {
			$validade = explode('/', $data['validade_produto_itensentrada']);
			$data['validade_produto_itensentrada'] = $validade[1] . '-' . $validade[0] . '-' . date('t', mktime(0, 0, 0, $validade[0], '01', $validade[1]));
		}
		$sql = 'INSERT INTO entradas_itens_entrada (entradas_itens_entrada.id_produto_itensentrada, entradas_itens_entrada.id_entrada_itensentrada, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas_itens_entrada.valor_produto_itensentrada, entradas_itens_entrada.validade_produto_itensentrada) VALUES (:id_produto_itensentrada, :id_entrada_itensentrada, :quantidade_comprada_itensentrada, :valor_produto_itensentrada, :validade_produto_itensentrada)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_produto_itensentrada', $data['id_produto_itensentrada'], PDO::PARAM_INT);
			$stmt->bindParam('id_entrada_itensentrada', $data['id_entrada_itensentrada'], PDO::PARAM_INT);
			$stmt->bindParam('quantidade_comprada_itensentrada', $data['quantidade_comprada_itensentrada'], PDO::PARAM_INT);
			$stmt->bindParam('valor_produto_itensentrada', $data['valor_produto_itensentrada']);
			$stmt->bindParam('validade_produto_itensentrada', $data['validade_produto_itensentrada']);
			$stmt->execute();
			$data['id_itensentrada'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/upload', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$filename = $_FILES['file']['name'];
		$ext = pathinfo($filename, PATHINFO_EXTENSION);
		$sql = 'INSERT INTO entradas_anexos_entrada (entradas_anexos_entrada.id_entrada_anexoentrada, entradas_anexos_entrada.id_fornecedor_anexoentrada, entradas_anexos_entrada.num_nota_entrada_anexoentrada, entradas_anexos_entrada.local_anexoentrada) VALUES (:id_entrada_anexoentrada, :id_fornecedor_anexoentrada, :num_nota_entrada_anexoentrada, :file)';
		if (move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . '/media/notas/' . $data['id_fornecedor_anexoentrada'] . '_' . $data['num_nota_entrada_anexoentrada'] . '.' . $ext)) {
			$data['file'] =  $data['id_fornecedor_anexoentrada'] . '_' . $data['num_nota_entrada_anexoentrada'] . '.' . $ext;
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->bindParam('id_entrada_anexoentrada', $data['id_entrada_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('id_fornecedor_anexoentrada', $data['id_fornecedor_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('num_nota_entrada_anexoentrada', $data['num_nota_entrada_anexoentrada'], PDO::PARAM_INT);
				$stmt->bindParam('file', $data['file'], PDO::PARAM_STR);
				$stmt->execute();
				$data['id_anexoentrada'] = $db->lastInsertId();
				$db = null;
				$response->getBody()->write(json_encode($data));
			} catch (PDOException $e) {
				$response->getBody()->write(json_encode($e->getMessage()));
			}
		}
	});

	$app->get('/file/{id_entrada_anexoentrada}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT entradas_anexos_entrada.local_anexoentrada FROM entradas_anexos_entrada WHERE entradas_anexos_entrada.id_entrada_anexoentrada = :id_entrada_anexoentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_entrada_anexoentrada', $arguments['id_entrada_anexoentrada'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/ordemfornecimento', function () use ($app) {
	$app->get('/{id_ordemfornecimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT ordens_fornecimento.id_ordemfornecimento, ordens_fornecimento.num_ordemfornecimento, ordens_fornecimento.data_ordemfornecimento, ordens_fornecimento.periodo_ordemfornecimento, ordens_fornecimento.prioridade_ordemfornecimento, ordens_fornecimento.id_contrato_ordemfornecimento, ordens_fornecimento.local_ordemfornecimento, ordens_fornecimento.observacao_ordemfornecimento, contratos.sigla_contrato, contratos.num_contrato, contratos.objeto_contrato, departamentos.nome_departamento, fornecedores.nome_fornecedor FROM ordens_fornecimento INNER JOIN fornecedores ON ordens_fornecimento.id_fornecedor_ordemfornecimento = fornecedores.id_fornecedor INNER JOIN departamentos ON ordens_fornecimento.id_departamento_ordemfornecimento = departamentos.id_departamento INNER JOIN contratos ON ordens_fornecimento.id_contrato_ordemfornecimento = contratos.id_contrato WHERE ordens_fornecimento.id_ordemfornecimento = :id_ordemfornecimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_ordemfornecimento', $arguments['id_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = "SELECT ordens_fornecimento.id_ordemfornecimento, ordens_fornecimento.num_ordemfornecimento, ordens_fornecimento.data_ordemfornecimento, contratos.sigla_contrato, contratos.num_contrato, departamentos.nome_departamento, fornecedores.nome_fornecedor FROM ordens_fornecimento INNER JOIN fornecedores ON ordens_fornecimento.id_fornecedor_ordemfornecimento = fornecedores.id_fornecedor INNER JOIN departamentos ON ordens_fornecimento.id_departamento_ordemfornecimento = departamentos.id_departamento INNER JOIN contratos ON ordens_fornecimento.id_contrato_ordemfornecimento = contratos.id_contrato ORDER BY ordens_fornecimento.num_ordemfornecimento DESC";
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id_ordemfornecimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM ordens_fornecimento WHERE ordens_fornecimento.id_ordemfornecimento = :id_ordemfornecimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_ordemfornecimento', $arguments['id_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO ordens_fornecimento (ordens_fornecimento.id_fornecedor_ordemfornecimento, ordens_fornecimento.id_contrato_ordemfornecimento, ordens_fornecimento.id_departamento_ordemfornecimento, ordens_fornecimento.data_ordemfornecimento, ordens_fornecimento.periodo_ordemfornecimento, ordens_fornecimento.prioridade_ordemfornecimento, ordens_fornecimento.local_ordemfornecimento, ordens_fornecimento.observacao_ordemfornecimento) VALUES (:id_fornecedor_ordemfornecimento, :id_contrato_ordemfornecimento, :id_departamento_ordemfornecimento, :data_ordemfornecimento, :periodo_ordemfornecimento, :prioridade_ordemfornecimento, :local_ordemfornecimento, :observacao_ordemfornecimento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor_ordemfornecimento', $data['id_fornecedor_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('id_contrato_ordemfornecimento', $data['id_contrato_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('id_departamento_ordemfornecimento', $data['id_departamento_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('data_ordemfornecimento', $data['data_ordemfornecimento']);
			$stmt->bindParam('periodo_ordemfornecimento', $data['periodo_ordemfornecimento'], PDO::PARAM_STR);
			$stmt->bindParam('prioridade_ordemfornecimento', $data['prioridade_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('local_ordemfornecimento', $data['local_ordemfornecimento'], PDO::PARAM_STR);
			$stmt->bindParam('observacao_ordemfornecimento', $data['observacao_ordemfornecimento'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_ordemfornecimento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/produtos/{id_ordemfornecimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, produtos.fabricante_produto, ordens_itens_ordemfornecimento.quantidade_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.valor_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.id_itensordemfornecimento FROM produtos INNER JOIN ordens_itens_ordemfornecimento ON produtos.id_produto = ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = :id_ordemfornecimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_ordemfornecimento', $arguments['id_ordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/itens/{id_itensordemfornecimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.id_produto, produtos.descricao_produto, produtos.unidade_produto, produtos.fabricante_produto, ordens_itens_ordemfornecimento.quantidade_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.valor_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.id_itensordemfornecimento FROM produtos INNER JOIN ordens_itens_ordemfornecimento ON produtos.id_produto = ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento WHERE ordens_itens_ordemfornecimento.id_itensordemfornecimento = :id_itensordemfornecimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensordemfornecimento', $arguments['id_itensordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/itens/{id_itensordemfornecimento}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM ordens_itens_ordemfornecimento WHERE ordens_itens_ordemfornecimento.id_itensordemfornecimento = :id_itensordemfornecimento';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_itensordemfornecimento', $arguments['id_itensordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->post('/itens', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO ordens_itens_ordemfornecimento (ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento, ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.valor_produto_itensordemfornecimento, ordens_itens_ordemfornecimento.quantidade_produto_itensordemfornecimento) VALUES (:id_ordem_itensordemfornecimento, :id_produto_itensordemfornecimento, :valor_produto_itensordemfornecimento, :quantidade_produto_itensordemfornecimento)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_ordem_itensordemfornecimento', $data['id_ordem_itensordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('id_produto_itensordemfornecimento', $data['id_produto_itensordemfornecimento'], PDO::PARAM_INT);
			$stmt->bindParam('valor_produto_itensordemfornecimento', $data['valor_produto_itensordemfornecimento']);
			$stmt->bindParam('quantidade_produto_itensordemfornecimento', $data['quantidade_produto_itensordemfornecimento'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_itensordemfornecimento'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/relatorios', function () use ($app) {
	$app->get('/departamentos/{id_departamento}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, SUM(saidas_itens_saida.quantidade_saida_itenssaida) AS quantidade_saida, produtos.unidade_produto FROM saidas_itens_saida INNER JOIN saidas ON saidas_itens_saida.id_saida_itenssaida = saidas.id_saida INNER JOIN produtos ON saidas_itens_saida.id_produto_itenssaida = produtos.id_produto WHERE DATE(saidas.data_saida) BETWEEN :inicio_periodo AND :fim_periodo AND saidas.id_departamento_saida = :id_departamento GROUP BY saidas_itens_saida.id_produto_itenssaida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_departamento', $arguments['id_departamento'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/entradas/{id_recurso}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, SUM(entradas_itens_entrada.quantidade_comprada_itensentrada) AS quantidade_comprada, produtos.unidade_produto FROM entradas_itens_entrada INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada INNER JOIN produtos ON entradas_itens_entrada.id_produto_itensentrada = produtos.id_produto WHERE DATE(entradas.data_entrada) BETWEEN :inicio_periodo AND :fim_periodo AND entradas.id_recurso_entrada = :id_recurso GROUP BY entradas_itens_entrada.id_produto_itensentrada';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_recurso', $arguments['id_recurso'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/fornecedores/{id_fornecedor}/{id_recurso}/{inicio_periodo}/{fim_periodo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, produtos.unidade_produto, entradas_itens_entrada.quantidade_comprada_itensentrada, entradas.id_entrada, entradas.data_emissao_nota_entrada, entradas.num_entrada, entradas.num_nota_entrada FROM produtos INNER JOIN entradas_itens_entrada ON produtos.id_produto = entradas_itens_entrada.id_produto_itensentrada INNER JOIN entradas ON entradas_itens_entrada.id_entrada_itensentrada = entradas.id_entrada INNER JOIN fornecedores ON entradas.id_fornecedor_entrada = fornecedores.id_fornecedor WHERE fornecedores.id_fornecedor = :id_fornecedor AND entradas.id_recurso_entrada = :id_recurso AND entradas.data_entrada BETWEEN :inicio_periodo AND :fim_periodo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_fornecedor', $arguments['id_fornecedor'], PDO::PARAM_INT);
			$stmt->bindParam('id_recurso', $arguments['id_recurso'], PDO::PARAM_INT);
			$stmt->bindParam('inicio_periodo', $arguments['inicio_periodo']);
			$stmt->bindParam('fim_periodo', $arguments['fim_periodo']);
			$stmt->execute();
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/estoque', function () use ($app) {
	$app->get('/consulta', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, produtos.localizacao_produto, produtos.unidade_produto, (SELECT COALESCE(SUM(entradas_itens_entrada.quantidade_comprada_itensentrada), 0) FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_produto_itensentrada = produtos.id_produto) AS quantidade_comprada, (SELECT COALESCE(SUM(saidas_itens_saida.quantidade_saida_itenssaida), 0) FROM saidas_itens_saida WHERE saidas_itens_saida.id_produto_itenssaida = produtos.id_produto) AS quantidade_saida FROM produtos WHERE produtos.status_produto = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/produto/{id_produto}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT (SELECT COALESCE(SUM(entradas_itens_entrada.quantidade_comprada_itensentrada), 0) FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_produto_itensentrada = :id_produto) AS quantidade_entrada, (SELECT COALESCE(SUM(saidas_itens_saida.quantidade_saida_itenssaida), 0) FROM saidas_itens_saida WHERE saidas_itens_saida.id_produto_itenssaida = :id_produto) AS quantidade_saida';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_produto', $arguments['id_produto'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/dashboard', function () use ($app) {
	$app->get('/contratos/tipos', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT COUNT(contratos.id_contrato) AS quantidade_contrato, contratos.tipo_contrato FROM contratos GROUP BY contratos.tipo_contrato';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/saldo/produtos/contratos', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, contratos_itens_contrato.saldo_produto_itenscontrato, contratos_itens_contrato.saldo_produto_emuso_itenscontrato FROM produtos INNER JOIN contratos_itens_contrato ON produtos.id_produto = contratos_itens_contrato.id_produto_itenscontrato WHERE (contratos_itens_contrato.saldo_produto_itenscontrato - contratos_itens_contrato.saldo_produto_emuso_itenscontrato) <= produtos.estoque_minimo_produto AND produtos.status_produto = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/saldo/produtos/estoque', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT produtos.descricao_produto, (SELECT COALESCE(SUM(entradas_itens_entrada.quantidade_comprada_itensentrada), 0) FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_produto_itensentrada = produtos.id_produto) AS quantidade_comprada, (SELECT COALESCE(SUM(saidas_itens_saida.quantidade_saida_itenssaida), 0) FROM saidas_itens_saida WHERE saidas_itens_saida.id_produto_itenssaida = produtos.id_produto) AS quantidade_saida FROM produtos WHERE (SELECT COALESCE(SUM(entradas_itens_entrada.quantidade_comprada_itensentrada), 0) FROM entradas_itens_entrada WHERE entradas_itens_entrada.id_produto_itensentrada = produtos.id_produto) - (SELECT COALESCE(SUM(saidas_itens_saida.quantidade_saida_itenssaida), 0) FROM saidas_itens_saida WHERE saidas_itens_saida.id_produto_itenssaida = produtos.id_produto) <= produtos.estoque_minimo_produto AND produtos.status_produto = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/contratos/dias/termino', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT contratos.id_contrato, contratos.tipo_contrato, contratos.sigla_contrato, contratos.num_contrato, contratos.fim_contrato, TIMESTAMPDIFF(DAY, CURRENT_DATE(), contratos.fim_contrato) AS dias_termino FROM contratos WHERE TIMESTAMPDIFF(DAY, CURRENT_DATE(), contratos.fim_contrato) <= 90 AND TIMESTAMPDIFF(DAY, CURRENT_DATE(), contratos.fim_contrato) > 0';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$dado = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->run();
