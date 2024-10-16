-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 26, 2024 at 02:46 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestor_tareas`
--

-- --------------------------------------------------------

--
-- Table structure for table `tareas`
--

CREATE TABLE `tareas` (
  `id` int(3) NOT NULL,
  `titulo` varchar(30) NOT NULL,
  `descr` varchar(300) NOT NULL,
  `estado` varchar(15) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tareas`
--

INSERT INTO `tareas` (`id`, `titulo`, `descr`, `estado`, `fecha`, `vencimiento`) VALUES
(1, 'Estudiar mucho PHP', 'Me encanta PHP y le voy a dedicar un montón de horas ', 'urgente', '2024-04-25 07:15:25', '2024-04-26'),
(6, 'titulo3', 'lMe encanta PHP y le voy a dedicar un montón de horas', 'finalizada', '2024-04-24 20:31:38', '2024-04-30'),
(7, 'Estudiar mucho PHP', 'Me encanta PHP y le voy a dedicar un montón de horas. Y Me encanta PHP y le voy a dedicar un montón de horas', 'ejecucion', '2024-04-26 14:44:40', '2024-04-24'),
(8, 'Ejemplo2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'pendiente', '2024-04-26 14:43:58', NULL),
(9, 'Ejemplo3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'urgente', '2024-04-26 14:44:17', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
