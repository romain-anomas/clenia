-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2026 at 03:51 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pssms`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `PlateNumber` varchar(20) NOT NULL,
  `DriverName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`PlateNumber`, `DriverName`, `PhoneNumber`) VALUES
('RAA123A', 'Romain ISHIMWE', '+250 788 123 456'),
('RAA34B', 'BARAHIRWA Yves', '0794944651'),
('RAB456B', 'Marie Claire Uwimana', '+250 789 654 321'),
('RAC789C', 'ishimwe romain', '0793450646'),
('RAD012D', 'Aimee Clenie', '0796914513'),
('RAE345E', 'Anick Kazuba', '0795805090');

-- --------------------------------------------------------

--
-- Table structure for table `parkingrecords`
--

CREATE TABLE `parkingrecords` (
  `RecordID` int(11) NOT NULL,
  `PlateNumber` varchar(20) NOT NULL,
  `SlotNumber` varchar(20) NOT NULL,
  `EntryTime` datetime NOT NULL,
  `ExitTime` datetime DEFAULT NULL,
  `Duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parkingrecords`
--

INSERT INTO `parkingrecords` (`RecordID`, `PlateNumber`, `SlotNumber`, `EntryTime`, `ExitTime`, `Duration`) VALUES
(1, 'RAA123A', ' RAA123A', '2026-02-05 16:04:00', NULL, NULL),
(2, 'RAB456B', 'RAE345E', '2026-02-05 16:05:00', '2026-02-05 16:06:00', 1),
(3, 'RAA34B', ' RAA34B', '2026-02-05 16:20:00', '2026-02-05 16:21:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `parkingslots`
--

CREATE TABLE `parkingslots` (
  `SlotNumber` varchar(20) NOT NULL,
  `SlotStatus` enum('Available','Occupied','Maintenance') DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parkingslots`
--

INSERT INTO `parkingslots` (`SlotNumber`, `SlotStatus`) VALUES
(' RAA123A', 'Occupied'),
(' RAA34B', 'Available'),
('RAB456B', 'Occupied'),
('RAD012D', 'Maintenance'),
('RAE345E', 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL,
  `RecordID` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`PaymentID`, `RecordID`, `AmountPaid`, `PaymentDate`) VALUES
(1, 2, 500.00, '2026-02-05 14:06:52'),
(2, 3, 500.00, '2026-02-05 14:21:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$MynBW.hxuotVKPtb5Ol7zuUa0J6i1948qu.PJP.gKTrAlOu5rEugu', '2026-02-03 16:39:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`PlateNumber`);

--
-- Indexes for table `parkingrecords`
--
ALTER TABLE `parkingrecords`
  ADD PRIMARY KEY (`RecordID`),
  ADD KEY `PlateNumber` (`PlateNumber`),
  ADD KEY `SlotNumber` (`SlotNumber`);

--
-- Indexes for table `parkingslots`
--
ALTER TABLE `parkingslots`
  ADD PRIMARY KEY (`SlotNumber`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `RecordID` (`RecordID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `parkingrecords`
--
ALTER TABLE `parkingrecords`
  MODIFY `RecordID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `parkingrecords`
--
ALTER TABLE `parkingrecords`
  ADD CONSTRAINT `parkingrecords_ibfk_1` FOREIGN KEY (`PlateNumber`) REFERENCES `cars` (`PlateNumber`) ON DELETE CASCADE,
  ADD CONSTRAINT `parkingrecords_ibfk_2` FOREIGN KEY (`SlotNumber`) REFERENCES `parkingslots` (`SlotNumber`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `parkingrecords` (`RecordID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
