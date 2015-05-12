-- DELETING EXISTING DATABASES
DROP DATABASE IF EXISTS lt;

-- CREATING THE DATABASE
CREATE DATABASE lt;

USE lt;

-- 
-- CREATING TABLES
-- 

-- TABLE OF USERS
CREATE TABLE users (
	id_user INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	email CHAR(100) UNIQUE,
	password CHAR(200) NOT NULL
)ENGINE=INNODB;

-- TABLE OF NOTEBOOKS
CREATE TABLE notebooks (
	id_notebook INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	name CHAR(100) NOT NULL,
	owner INT(11) UNSIGNED
)ENGINE=INNODB;

-- FOREIGN KEY
ALTER TABLE notebooks ADD CONSTRAINT
ClaveF1 FOREIGN KEY (owner) REFERENCES users(id_user)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- TABLE OF NOTES
CREATE TABLE notes (
	id_note INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	title CHAR(100) NOT NULL,
	content CHAR(250) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	notebook INT(11) UNSIGNED
)ENGINE=INNODB;

-- FOREIGN KEY
ALTER TABLE notes ADD CONSTRAINT
ClaveF2 FOREIGN KEY (notebook) REFERENCES notebooks(id_notebook)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- TABLE OF DOCUMENTS
CREATE TABLE documents (
	id_document INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	name CHAR(100) NOT NULL,
	url CHAR(250) NOT NULL,
	note INT(11) UNSIGNED
)ENGINE=INNODB;

-- FOREIGN KEY
ALTER TABLE documents ADD CONSTRAINT
ClaveF3 FOREIGN KEY (note) REFERENCES notes(id_note)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- TABLE OF REMINDERS
CREATE TABLE reminders (
	id_reminder INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	d_reminder DATETIME NOT NULL,
	sent BOOLEAN NOT NULL DEFAULT FALSE,
	note INT(11) UNSIGNED
)ENGINE=INNODB;

-- FOREIGN KEY
ALTER TABLE reminders ADD CONSTRAINT
ClaveF4 FOREIGN KEY (note) REFERENCES notes(id_note)
ON DELETE CASCADE
ON UPDATE CASCADE;
