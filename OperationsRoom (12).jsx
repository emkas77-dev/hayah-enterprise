-- =====================================================
-- HAYAH Enterprise V2.0
-- Database Creation Script
-- PostgreSQL
-- =====================================================

CREATE DATABASE hayah_enterprise
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0;

-- الاتصال بقاعدة البيانات
\c hayah_enterprise;

-- إنشاء Schema
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS assets;
CREATE SCHEMA IF NOT EXISTS maintenance;
CREATE SCHEMA IF NOT EXISTS laboratory;
CREATE SCHEMA IF NOT EXISTS customers;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS reports;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS gis;

-- امتدادات PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
