-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 01/06/2021 às 13:01
-- Versão do servidor: 10.3.29-MariaDB-0ubuntu0.20.04.1
-- Versão do PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `GESTOR`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `contratos`
--

CREATE TABLE `contratos` (
  `id_contrato` int(10) UNSIGNED NOT NULL,
  `tipo_contrato` enum('1','2','3','4') NOT NULL,
  `id_fornecedor_contrato` int(10) UNSIGNED NOT NULL,
  `sigla_contrato` varchar(30) NOT NULL,
  `num_contrato` varchar(9) NOT NULL,
  `inicio_contrato` date NOT NULL,
  `fim_contrato` date NOT NULL,
  `objeto_contrato` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contratos_anexos_contrato`
--

CREATE TABLE `contratos_anexos_contrato` (
  `id_anexocontrato` int(10) UNSIGNED NOT NULL,
  `id_contrato_anexocontrato` int(10) UNSIGNED NOT NULL,
  `id_fornecedor_anexocontrato` int(10) UNSIGNED NOT NULL,
  `num_contrato_anexocontrato` varchar(8) NOT NULL,
  `local_anexocontrato` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contratos_itens_contrato`
--

CREATE TABLE `contratos_itens_contrato` (
  `id_itenscontrato` int(10) UNSIGNED NOT NULL,
  `id_contrato_itenscontrato` int(10) UNSIGNED NOT NULL,
  `id_produto_itenscontrato` int(10) UNSIGNED NOT NULL,
  `valor_produto_itenscontrato` decimal(8,2) UNSIGNED NOT NULL,
  `saldo_produto_itenscontrato` int(10) UNSIGNED NOT NULL,
  `saldo_produto_emuso_itenscontrato` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(10) UNSIGNED NOT NULL,
  `nome_departamento` varchar(150) NOT NULL,
  `responsavel_departamento` varchar(150) NOT NULL,
  `tel_responsavel_departamento` bigint(11) UNSIGNED NOT NULL,
  `cep_departamento` int(8) UNSIGNED ZEROFILL NOT NULL,
  `cidade_departamento` varchar(200) NOT NULL,
  `estado_departamento` varchar(2) NOT NULL,
  `logradouro_departamento` varchar(300) NOT NULL,
  `numero_departamento` varchar(10) NOT NULL,
  `bairro_departamento` varchar(200) NOT NULL,
  `complemento_departamento` varchar(200) DEFAULT NULL,
  `referencia_departamento` varchar(200) DEFAULT NULL,
  `status_departamento` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas`
--

CREATE TABLE `entradas` (
  `id_entrada` int(10) UNSIGNED NOT NULL,
  `num_entrada` int(10) UNSIGNED DEFAULT NULL,
  `num_nota_entrada` int(10) UNSIGNED NOT NULL,
  `data_emissao_nota_entrada` date NOT NULL,
  `data_entrada` date NOT NULL,
  `id_fornecedor_entrada` int(10) UNSIGNED NOT NULL,
  `id_recurso_entrada` tinyint(1) UNSIGNED NOT NULL,
  `id_usuario_entrada` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `entradas`
--
DELIMITER $$
CREATE TRIGGER `INSERT NUM ENTRADA` BEFORE INSERT ON `entradas` FOR EACH ROW IF (
    SELECT MAX(entradas.num_entrada)
    FROM entradas
    WHERE YEAR(entradas.data_entrada) = YEAR(NOW())
  ) THEN
SET NEW.num_entrada = (
	SELECT MAX(entradas.num_entrada)
	FROM entradas
	WHERE YEAR(entradas.data_entrada) = YEAR(NOW())
  ) + 1;
ELSE
SET NEW.num_entrada = 1;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas_anexos_entrada`
--

CREATE TABLE `entradas_anexos_entrada` (
  `id_anexoentrada` int(10) UNSIGNED NOT NULL,
  `id_entrada_anexoentrada` int(10) UNSIGNED NOT NULL,
  `id_fornecedor_anexoentrada` int(10) UNSIGNED NOT NULL,
  `num_nota_entrada_anexoentrada` int(10) UNSIGNED NOT NULL,
  `local_anexoentrada` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas_itens_entrada`
--

CREATE TABLE `entradas_itens_entrada` (
  `id_itensentrada` int(10) UNSIGNED NOT NULL,
  `id_produto_itensentrada` int(10) UNSIGNED NOT NULL,
  `id_entrada_itensentrada` int(10) UNSIGNED NOT NULL,
  `quantidade_comprada_itensentrada` int(10) UNSIGNED NOT NULL,
  `valor_produto_itensentrada` decimal(8,2) UNSIGNED NOT NULL,
  `validade_produto_itensentrada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedores`
--

CREATE TABLE `fornecedores` (
  `id_fornecedor` int(10) UNSIGNED NOT NULL,
  `cnpj_fornecedor` varchar(14) NOT NULL,
  `nome_fornecedor` varchar(200) NOT NULL,
  `contato_fornecedor` varchar(200) NOT NULL,
  `email_fornecedor` varchar(50) NOT NULL,
  `cep_fornecedor` int(8) UNSIGNED ZEROFILL NOT NULL,
  `cidade_fornecedor` varchar(200) NOT NULL,
  `estado_fornecedor` varchar(2) NOT NULL,
  `logradouro_fornecedor` varchar(300) NOT NULL,
  `numero_fornecedor` varchar(10) NOT NULL,
  `bairro_fornecedor` varchar(200) NOT NULL,
  `complemento_fornecedor` varchar(200) DEFAULT '',
  `status_fornecedor` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ordens_fornecimento`
--

CREATE TABLE `ordens_fornecimento` (
  `id_ordemfornecimento` int(10) UNSIGNED NOT NULL,
  `id_fornecedor_ordemfornecimento` int(10) UNSIGNED NOT NULL,
  `id_contrato_ordemfornecimento` int(10) UNSIGNED NOT NULL,
  `id_departamento_ordemfornecimento` int(10) UNSIGNED NOT NULL,
  `data_ordemfornecimento` date NOT NULL,
  `periodo_ordemfornecimento` varchar(30) NOT NULL,
  `prioridade_ordemfornecimento` enum('1','2','3') NOT NULL,
  `local_ordemfornecimento` text NOT NULL,
  `observacao_ordemfornecimento` text NOT NULL,
  `num_ordemfornecimento` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `ordens_fornecimento`
--
DELIMITER $$
CREATE TRIGGER `INSERT NUM ORDEM` BEFORE INSERT ON `ordens_fornecimento` FOR EACH ROW IF (
    SELECT MAX(ordens_fornecimento.num_ordemfornecimento)
    FROM ordens_fornecimento
    WHERE YEAR(ordens_fornecimento.data_ordemfornecimento) = YEAR(NOW())
  ) THEN
SET NEW.num_ordemfornecimento = (
 	SELECT MAX(ordens_fornecimento.num_ordemfornecimento)
    FROM ordens_fornecimento
    WHERE YEAR(ordens_fornecimento.data_ordemfornecimento) = YEAR(NOW())
  ) + 1;
ELSE
SET NEW.num_ordemfornecimento = 1;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ordens_itens_ordemfornecimento`
--

CREATE TABLE `ordens_itens_ordemfornecimento` (
  `id_itensordemfornecimento` int(10) UNSIGNED NOT NULL,
  `id_ordem_itensordemfornecimento` int(10) UNSIGNED NOT NULL,
  `id_produto_itensordemfornecimento` int(10) UNSIGNED NOT NULL,
  `valor_produto_itensordemfornecimento` decimal(8,2) UNSIGNED NOT NULL,
  `quantidade_produto_itensordemfornecimento` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `ordens_itens_ordemfornecimento`
--
DELIMITER $$
CREATE TRIGGER `SOMA SALDO EM USO` AFTER INSERT ON `ordens_itens_ordemfornecimento` FOR EACH ROW IF (NEW.quantidade_produto_itensordemfornecimento) THEN
SET @teste = (
    SELECT contratos_itens_contrato.saldo_produto_emuso_itenscontrato
    FROM contratos_itens_contrato
    WHERE contratos_itens_contrato.id_contrato_itenscontrato = (SELECT ordens_fornecimento.id_contrato_ordemfornecimento
    FROM ordens_fornecimento
      INNER JOIN ordens_itens_ordemfornecimento ON ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = ordens_fornecimento.id_ordemfornecimento
    WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = NEW.id_ordem_itensordemfornecimento
      AND ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento = NEW.id_produto_itensordemfornecimento
  ) AND contratos_itens_contrato.id_produto_itenscontrato = NEW.id_produto_itensordemfornecimento
  ) + NEW.quantidade_produto_itensordemfornecimento;
IF (
  @teste <= (SELECT contratos_itens_contrato.saldo_produto_itenscontrato
    FROM contratos_itens_contrato
    WHERE contratos_itens_contrato.id_contrato_itenscontrato = (SELECT ordens_fornecimento.id_contrato_ordemfornecimento
    FROM ordens_fornecimento
      INNER JOIN ordens_itens_ordemfornecimento ON ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = ordens_fornecimento.id_ordemfornecimento
    WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = NEW.id_ordem_itensordemfornecimento
      AND ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento = NEW.id_produto_itensordemfornecimento
  ) AND contratos_itens_contrato.id_produto_itenscontrato = NEW.id_produto_itensordemfornecimento
  )
) THEN
UPDATE contratos_itens_contrato
SET contratos_itens_contrato.saldo_produto_emuso_itenscontrato = contratos_itens_contrato.saldo_produto_emuso_itenscontrato + NEW.quantidade_produto_itensordemfornecimento
WHERE contratos_itens_contrato.id_contrato_itenscontrato = (
    SELECT ordens_fornecimento.id_contrato_ordemfornecimento
    FROM ordens_fornecimento
      INNER JOIN ordens_itens_ordemfornecimento ON ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = ordens_fornecimento.id_ordemfornecimento
    WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = NEW.id_ordem_itensordemfornecimento
      AND ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento = NEW.id_produto_itensordemfornecimento
  )
  AND contratos_itens_contrato.id_produto_itenscontrato = NEW.id_produto_itensordemfornecimento;
ELSE SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'DISTRIBUICAO ACIMA DA ENTRADA';
END IF;
END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `SUBTRAI SALDO EM USO` BEFORE DELETE ON `ordens_itens_ordemfornecimento` FOR EACH ROW IF (OLD.quantidade_produto_itensordemfornecimento) THEN
SET @teste = (
    SELECT contratos_itens_contrato.saldo_produto_emuso_itenscontrato
    FROM contratos_itens_contrato
    WHERE contratos_itens_contrato.id_contrato_itenscontrato = (SELECT ordens_fornecimento.id_contrato_ordemfornecimento
    FROM ordens_fornecimento
      INNER JOIN ordens_itens_ordemfornecimento ON ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = ordens_fornecimento.id_ordemfornecimento
    WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = OLD.id_ordem_itensordemfornecimento
      AND ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento = OLD.id_produto_itensordemfornecimento
  ) AND contratos_itens_contrato.id_produto_itenscontrato = OLD.id_produto_itensordemfornecimento
  ) - OLD.quantidade_produto_itensordemfornecimento;
IF (@teste >=  0) THEN
UPDATE contratos_itens_contrato
SET contratos_itens_contrato.saldo_produto_emuso_itenscontrato = contratos_itens_contrato.saldo_produto_emuso_itenscontrato - OLD.quantidade_produto_itensordemfornecimento
WHERE contratos_itens_contrato.id_contrato_itenscontrato = (
    SELECT ordens_fornecimento.id_contrato_ordemfornecimento
    FROM ordens_fornecimento
      INNER JOIN ordens_itens_ordemfornecimento ON ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = ordens_fornecimento.id_ordemfornecimento
    WHERE ordens_itens_ordemfornecimento.id_ordem_itensordemfornecimento = OLD.id_ordem_itensordemfornecimento
      AND ordens_itens_ordemfornecimento.id_produto_itensordemfornecimento = OLD.id_produto_itensordemfornecimento
  ) AND contratos_itens_contrato.id_produto_itenscontrato = OLD.id_produto_itensordemfornecimento;
ELSE SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'ENTRADA JA EXCLUIDA';
END IF;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

CREATE TABLE `produtos` (
  `id_produto` int(10) UNSIGNED NOT NULL,
  `descricao_produto` varchar(400) NOT NULL,
  `fabricante_produto` varchar(200) DEFAULT NULL,
  `localizacao_produto` varchar(100) DEFAULT NULL,
  `unidade_produto` varchar(2) NOT NULL,
  `valor_produto` decimal(8,2) UNSIGNED NOT NULL,
  `estoque_minimo_produto` int(10) UNSIGNED NOT NULL,
  `status_produto` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `saidas`
--

CREATE TABLE `saidas` (
  `id_saida` int(10) UNSIGNED NOT NULL,
  `num_saida` int(10) UNSIGNED DEFAULT NULL,
  `data_saida` date NOT NULL,
  `id_departamento_saida` int(10) UNSIGNED NOT NULL,
  `oficio_saida` varchar(8) DEFAULT NULL,
  `id_usuario_saida` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `saidas`
--
DELIMITER $$
CREATE TRIGGER `INSERT NUM SAIDA` BEFORE INSERT ON `saidas` FOR EACH ROW IF (
    SELECT MAX(saidas.num_saida)
    FROM saidas
    WHERE YEAR(saidas.data_saida) = YEAR(NOW())
  ) THEN
SET NEW.num_saida = (
    SELECT MAX(saidas.num_saida)
    FROM saidas
    WHERE YEAR(saidas.data_saida) = YEAR(NOW())
   ) + 1;
ELSE
SET NEW.num_saida = 1;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `saidas_itens_saida`
--

CREATE TABLE `saidas_itens_saida` (
  `id_itenssaida` int(10) UNSIGNED NOT NULL,
  `id_produto_itenssaida` int(10) UNSIGNED NOT NULL,
  `id_saida_itenssaida` int(10) UNSIGNED NOT NULL,
  `quantidade_saida_itenssaida` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `user` varchar(10) NOT NULL,
  `pass` varchar(8) NOT NULL DEFAULT 'mudar123',
  `token` varchar(32) NOT NULL DEFAULT '39a79d21c45fa98d20394cd9b5f1617a',
  `flag` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `status_user` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `user`, `pass`, `token`, `flag`, `status_user`) VALUES
(1, 'ADMINISTRADOR', 'root', 'mudar123', '39a79d21c45fa98d20394cd9b5f1617a', 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `veiculos`
--

CREATE TABLE `veiculos` (
  `id_veiculo` int(10) UNSIGNED NOT NULL,
  `tipo_veiculo` varchar(9) NOT NULL,
  `marca_veiculo` int(10) UNSIGNED NOT NULL,
  `modelo_veiculo` int(10) UNSIGNED NOT NULL,
  `placa_veiculo` varchar(7) NOT NULL,
  `renavam_veiculo` varchar(11) NOT NULL,
  `ano_fabricacao_veiculo` varchar(4) NOT NULL,
  `ano_modelo_veiculo` varchar(4) NOT NULL,
  `combustivel_veiculo` enum('1','2','3','4','5','6') NOT NULL,
  `cor_veiculo` varchar(20) NOT NULL,
  `situacao_veiculo` enum('1','2','3') NOT NULL,
  `tipo_frota_veiculo` enum('1','2') NOT NULL,
  `status_veiculo` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`id_contrato`),
  ADD UNIQUE KEY `UNICO NUMERO DE CONTRATO` (`num_contrato`,`id_fornecedor_contrato`),
  ADD KEY `FORNECEDOR CONTRATO` (`id_fornecedor_contrato`);

--
-- Índices de tabela `contratos_anexos_contrato`
--
ALTER TABLE `contratos_anexos_contrato`
  ADD PRIMARY KEY (`id_anexocontrato`),
  ADD UNIQUE KEY `UNICO NUMERO DE CONTRATO` (`id_contrato_anexocontrato`,`num_contrato_anexocontrato`),
  ADD KEY `ID DO CONTRATO` (`id_contrato_anexocontrato`),
  ADD KEY `ID DO FORNECEDOR` (`id_fornecedor_anexocontrato`),
  ADD KEY `NUM DO CONTRATO` (`num_contrato_anexocontrato`);

--
-- Índices de tabela `contratos_itens_contrato`
--
ALTER TABLE `contratos_itens_contrato`
  ADD PRIMARY KEY (`id_itenscontrato`),
  ADD UNIQUE KEY `UNICO PRODUTO POR CONTRATO` (`id_contrato_itenscontrato`,`id_produto_itenscontrato`),
  ADD KEY `CONTRATO_ID` (`id_contrato_itenscontrato`),
  ADD KEY `PRODUTO_ID` (`id_produto_itenscontrato`);

--
-- Índices de tabela `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`),
  ADD UNIQUE KEY `DEPARTAMENTO UNICO` (`nome_departamento`) USING BTREE;

--
-- Índices de tabela `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id_entrada`),
  ADD UNIQUE KEY `UNICO FORNECEDOR POR NOTA` (`num_nota_entrada`,`id_fornecedor_entrada`),
  ADD KEY `FORNECEDOR INDEX` (`id_fornecedor_entrada`) USING BTREE,
  ADD KEY `USUARIO INDEX` (`id_usuario_entrada`) USING BTREE;

--
-- Índices de tabela `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  ADD PRIMARY KEY (`id_anexoentrada`),
  ADD UNIQUE KEY `UNICO FORNECEDOR POR NOTA` (`id_fornecedor_anexoentrada`,`num_nota_entrada_anexoentrada`),
  ADD KEY `ID ENTRADA INDEX` (`id_entrada_anexoentrada`) USING BTREE,
  ADD KEY `ID FORNECEDOR INDEX` (`id_fornecedor_anexoentrada`) USING BTREE,
  ADD KEY `NUMERO NOTA INDEX` (`num_nota_entrada_anexoentrada`) USING BTREE;

--
-- Índices de tabela `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  ADD PRIMARY KEY (`id_itensentrada`),
  ADD UNIQUE KEY `UNICO PRODUTO POR GUIA DE ENTRADA` (`id_produto_itensentrada`,`id_entrada_itensentrada`),
  ADD KEY `ENTRADA INDEX` (`id_entrada_itensentrada`) USING BTREE,
  ADD KEY `PRODUTO INDEX` (`id_produto_itensentrada`) USING BTREE;

--
-- Índices de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD PRIMARY KEY (`id_fornecedor`),
  ADD UNIQUE KEY `CNPJ UNICO` (`cnpj_fornecedor`) USING BTREE;

--
-- Índices de tabela `ordens_fornecimento`
--
ALTER TABLE `ordens_fornecimento`
  ADD PRIMARY KEY (`id_ordemfornecimento`),
  ADD KEY `ID DO FORNECEDOR` (`id_fornecedor_ordemfornecimento`),
  ADD KEY `ID DO CONTRATO` (`id_contrato_ordemfornecimento`),
  ADD KEY `ID DO DEPARTAMENTO` (`id_departamento_ordemfornecimento`);

--
-- Índices de tabela `ordens_itens_ordemfornecimento`
--
ALTER TABLE `ordens_itens_ordemfornecimento`
  ADD PRIMARY KEY (`id_itensordemfornecimento`),
  ADD UNIQUE KEY `UNICO PRODUTO POR ORDEM` (`id_ordem_itensordemfornecimento`,`id_produto_itensordemfornecimento`),
  ADD KEY `ID DA ORDEM` (`id_ordem_itensordemfornecimento`),
  ADD KEY `ID DO PRODUTO` (`id_produto_itensordemfornecimento`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD UNIQUE KEY `PRODUTO UNICO` (`descricao_produto`) USING BTREE;

--
-- Índices de tabela `saidas`
--
ALTER TABLE `saidas`
  ADD PRIMARY KEY (`id_saida`),
  ADD KEY `USUARIO INDEX` (`id_usuario_saida`) USING BTREE,
  ADD KEY `DEPARTAMENTO INDEX` (`id_departamento_saida`) USING BTREE;

--
-- Índices de tabela `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  ADD PRIMARY KEY (`id_itenssaida`),
  ADD UNIQUE KEY `UNICO ITEM POR SAIDA` (`id_produto_itenssaida`,`id_saida_itenssaida`),
  ADD KEY `SAIDA INDEX` (`id_saida_itenssaida`) USING BTREE,
  ADD KEY `PRODUTO INDEX` (`id_produto_itenssaida`) USING BTREE;

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNICO USER LOGIN` (`user`) USING BTREE;

--
-- Índices de tabela `veiculos`
--
ALTER TABLE `veiculos`
  ADD PRIMARY KEY (`id_veiculo`),
  ADD UNIQUE KEY `VEICULO UNICO` (`placa_veiculo`) USING BTREE;

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `contratos`
--
ALTER TABLE `contratos`
  MODIFY `id_contrato` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `contratos_anexos_contrato`
--
ALTER TABLE `contratos_anexos_contrato`
  MODIFY `id_anexocontrato` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `contratos_itens_contrato`
--
ALTER TABLE `contratos_itens_contrato`
  MODIFY `id_itenscontrato` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  MODIFY `id_anexoentrada` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  MODIFY `id_itensentrada` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  MODIFY `id_fornecedor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ordens_fornecimento`
--
ALTER TABLE `ordens_fornecimento`
  MODIFY `id_ordemfornecimento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ordens_itens_ordemfornecimento`
--
ALTER TABLE `ordens_itens_ordemfornecimento`
  MODIFY `id_itensordemfornecimento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id_produto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `saidas`
--
ALTER TABLE `saidas`
  MODIFY `id_saida` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  MODIFY `id_itenssaida` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `veiculos`
--
ALTER TABLE `veiculos`
  MODIFY `id_veiculo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `contratos`
--
ALTER TABLE `contratos`
  ADD CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`id_fornecedor_contrato`) REFERENCES `fornecedores` (`id_fornecedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `contratos_anexos_contrato`
--
ALTER TABLE `contratos_anexos_contrato`
  ADD CONSTRAINT `contratos_anexos_contrato_ibfk_1` FOREIGN KEY (`id_contrato_anexocontrato`) REFERENCES `contratos` (`id_contrato`),
  ADD CONSTRAINT `contratos_anexos_contrato_ibfk_2` FOREIGN KEY (`id_fornecedor_anexocontrato`) REFERENCES `fornecedores` (`id_fornecedor`),
  ADD CONSTRAINT `contratos_anexos_contrato_ibfk_3` FOREIGN KEY (`num_contrato_anexocontrato`) REFERENCES `contratos` (`num_contrato`);

--
-- Restrições para tabelas `contratos_itens_contrato`
--
ALTER TABLE `contratos_itens_contrato`
  ADD CONSTRAINT `contratos_itens_contrato_ibfk_1` FOREIGN KEY (`id_contrato_itenscontrato`) REFERENCES `contratos` (`id_contrato`),
  ADD CONSTRAINT `contratos_itens_contrato_ibfk_2` FOREIGN KEY (`id_produto_itenscontrato`) REFERENCES `produtos` (`id_produto`);

--
-- Restrições para tabelas `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `entradas_ibfk_2` FOREIGN KEY (`id_fornecedor_entrada`) REFERENCES `fornecedores` (`id_fornecedor`),
  ADD CONSTRAINT `entradas_ibfk_4` FOREIGN KEY (`id_usuario_entrada`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `entradas_anexos_entrada`
--
ALTER TABLE `entradas_anexos_entrada`
  ADD CONSTRAINT `entradas_anexos_entrada_ibfk_1` FOREIGN KEY (`id_entrada_anexoentrada`) REFERENCES `entradas` (`id_entrada`),
  ADD CONSTRAINT `entradas_anexos_entrada_ibfk_2` FOREIGN KEY (`id_fornecedor_anexoentrada`) REFERENCES `fornecedores` (`id_fornecedor`),
  ADD CONSTRAINT `entradas_anexos_entrada_ibfk_3` FOREIGN KEY (`num_nota_entrada_anexoentrada`) REFERENCES `entradas` (`num_nota_entrada`);

--
-- Restrições para tabelas `entradas_itens_entrada`
--
ALTER TABLE `entradas_itens_entrada`
  ADD CONSTRAINT `entradas_itens_entrada_ibfk_1` FOREIGN KEY (`id_entrada_itensentrada`) REFERENCES `entradas` (`id_entrada`),
  ADD CONSTRAINT `entradas_itens_entrada_ibfk_2` FOREIGN KEY (`id_produto_itensentrada`) REFERENCES `produtos` (`id_produto`);

--
-- Restrições para tabelas `ordens_fornecimento`
--
ALTER TABLE `ordens_fornecimento`
  ADD CONSTRAINT `ordens_fornecimento_ibfk_1` FOREIGN KEY (`id_fornecedor_ordemfornecimento`) REFERENCES `fornecedores` (`id_fornecedor`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `ordens_fornecimento_ibfk_2` FOREIGN KEY (`id_contrato_ordemfornecimento`) REFERENCES `contratos` (`id_contrato`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `ordens_fornecimento_ibfk_3` FOREIGN KEY (`id_departamento_ordemfornecimento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `ordens_itens_ordemfornecimento`
--
ALTER TABLE `ordens_itens_ordemfornecimento`
  ADD CONSTRAINT `ordens_itens_ordemfornecimento_ibfk_1` FOREIGN KEY (`id_ordem_itensordemfornecimento`) REFERENCES `ordens_fornecimento` (`id_ordemfornecimento`),
  ADD CONSTRAINT `ordens_itens_ordemfornecimento_ibfk_2` FOREIGN KEY (`id_produto_itensordemfornecimento`) REFERENCES `produtos` (`id_produto`);

--
-- Restrições para tabelas `saidas`
--
ALTER TABLE `saidas`
  ADD CONSTRAINT `saidas_ibfk_2` FOREIGN KEY (`id_departamento_saida`) REFERENCES `departamentos` (`id_departamento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `saidas_ibfk_3` FOREIGN KEY (`id_usuario_saida`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `saidas_itens_saida`
--
ALTER TABLE `saidas_itens_saida`
  ADD CONSTRAINT `saidas_itens_saida_ibfk_1` FOREIGN KEY (`id_saida_itenssaida`) REFERENCES `saidas` (`id_saida`),
  ADD CONSTRAINT `saidas_itens_saida_ibfk_2` FOREIGN KEY (`id_produto_itenssaida`) REFERENCES `produtos` (`id_produto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
