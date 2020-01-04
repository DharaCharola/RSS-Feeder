-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2019 at 03:24 PM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 5.6.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodeapi`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `category_image`) VALUES
(1, 'Garlic Bread', 'garlic_bread.jpg'),
(2, 'Pizza', 'pizza.jpg'),
(3, 'Beverages', 'vegetablejuice.jpg'),
(4, 'Dessert', 'dessert.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_price` decimal(65,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `category_id`, `product_name`, `product_image`, `product_price`) VALUES
(1, 1, 'Cheesy Garlic Bread', 'cheesy_garlic_bread.jpg', '100'),
(2, 1, 'Stuffed Cheese Garlic Bread', 'stuffed_cheese_garlic_bread.jpg', '150'),
(3, 2, 'Margherita Pizza', 'margherita_pizza.jpg', '250'),
(4, 2, 'Thin Crust Pizza', 'thin_crust_pizza.jpg', '190'),
(8, 4, 'Brownie Trifle', 'brownie-trifle-hero.jpg', '299'),
(9, 4, 'Sliced Cake', 'sliced.jpeg', '150'),
(10, 4, 'Purple Flower Cupcakes', 'cupcakes-flowers-purple.jpg', '230'),
(11, 3, 'Mint and Strawberry', 'mint-and-strawberry.jpg', '169'),
(12, 3, 'Soda Lemon', 'soda-lemon.jpeg', '70'),
(13, 2, 'Neapolitan Pizza', 'neapolitan_pizza.jpeg', '500'),
(14, 2, 'Farm House Pizza', 'farmhouse.jpeg', '250'),
(15, 3, 'Mojito', 'mojito.jpeg', '50'),
(16, 3, 'Strawberry Mojito', 'strawberry_mojito.jpeg', '70'),
(17, 4, 'Choclate Fondant', 'choclate_fondant.jpeg', '100'),
(18, 4, 'Brownie', 'brownie.jpeg', '50'),
(19, 1, 'Bread Stick', 'breadstick.jpeg', '100'),
(20, 2, 'Mexican Green Wave', 'mexican_green_wave.jpeg', '250'),
(21, 2, 'Double Cheese Pizza', 'double-cheese-pizza.jpeg', '300'),
(22, 2, 'Burger Pizza', 'burgerpizza.jpeg', '100'),
(23, 3, 'Bailley Water', 'bailley-water.jpeg', '20'),
(24, 3, 'Lipton Ice Tea', 'lipton-ice-tea.jpeg', '50'),
(25, 4, 'Gulab Jamun', 'gulab-jamun.jpeg', '50'),
(26, 4, 'Milk Cake', 'milk-cake.jpeg', '100'),
(27, 4, 'Ras-Malai', 'ras-malai.jpeg', '100');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
