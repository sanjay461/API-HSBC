CREATE DATABASE IF NOT EXISTS FinancialData;
USE FinancialData;

CREATE TABLE HSBC_Transactions (
    step INT,
    customer VARCHAR(255),
    age VARCHAR(10),
    gender VARCHAR(10),
    zipcodeOri VARCHAR(10),
    merchant VARCHAR(255),
    zipMerchant VARCHAR(10),
    category VARCHAR(255),
    amount DECIMAL(10, 2),
    fraud TINYINT
);