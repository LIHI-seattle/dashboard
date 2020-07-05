USE LIHI;
CREATE TABLE IF NOT EXISTS VILLAGES (VID INT PRIMARY KEY auto_increment, NAME VARCHAR(50) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS PERMISSIONS (ROLE_ID INT PRIMARY KEY auto_increment, ROLE_TYPE VARCHAR(255) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS PEOPLE (PID INT PRIMARY KEY auto_increment, FIRST_NAME VARCHAR(50) NOT NULL, LAST_NAME VARCHAR(50) NOT NULL, BIRTHDAY DATE, ROLE_ID INT NOT NULL, VID INT NULL, GENDER VARCHAR(50), EMPLOYMENT BOOLEAN, IDENTIFICATION BOOLEAN, PREVIOUS_RESIDENCE VARCHAR(256), DISABILITIES BOOLEAN, CHILDREN BOOLEAN, PREVIOUS_SHELTER_PROGRAM VARCHAR(256), CRIMINAL_HISTORY BOOLEAN, CONSTRAINT FK_Permission FOREIGN KEY (ROLE_ID) REFERENCES PERMISSIONS(ROLE_ID), CONSTRAINT FK_Village FOREIGN KEY (VID) REFERENCES VILLAGES(VID));
CREATE TABLE IF NOT EXISTS HOUSES (HOUSE_ID INT PRIMARY KEY auto_increment, HOUSE_NUM VARCHAR(50) NOT NULL, VID INT NOT NULL, VACANT BOOLEAN, CONSTRAINT FK_VID FOREIGN KEY (VID) REFERENCES VILLAGES(VID));
CREATE TABLE IF NOT EXISTS RESIDENTS (RID INT PRIMARY KEY auto_increment, PID INT NOT NULL, HOUSE_ID INT NOT NULL, START_DATE DATE NOT NULL, END_DATE DATE, IN_RESIDENCE BOOLEAN, CONSTRAINT FK_PeopleID FOREIGN KEY (PID) REFERENCES PEOPLE(PID), CONSTRAINT FK_HOUSEID FOREIGN KEY(HOUSE_ID) REFERENCES HOUSES(HOUSE_ID));
CREATE TABLE IF NOT EXISTS INCIDENTS (INID INT PRIMARY KEY auto_increment, INCIDENT_DATE DATE NOT NULL, TIME TIME NOT NULL, VID INT NOT NULL, LOCATION VARCHAR(255) NOT NULL, DESCRIPTION VARCHAR(1000), INJURY BOOLEAN NOT NULL, INJURY_DESCRIPTION VARCHAR(1000), ER_VISIT BOOLEAN NOT NULL, ER_HOSPITAL VARCHAR(255), POLICE_REPORT BOOLEAN NOT NULL, PR_NUMBER VARCHAR(255), AUTHOR_ID INT NOT NULL, REVIEWER_ID INT NOT NULL, AUTHOR_DATE DATE NOT NULL, CONSTRAINT FK_AUTHOR FOREIGN KEY (AUTHOR_ID) REFERENCES PEOPLE(PID), CONSTRAINT FK_REVIEWER FOREIGN KEY (REVIEWER_ID) REFERENCES PEOPLE(PID), CONSTRAINT FK_VILLAGE_ID FOREIGN KEY (VID) REFERENCES VILLAGES(VID))
CREATE TABLE IF NOT EXISTS INCIDENTS_PEOPLE (IP_ID INT PRIMARY KEY auto_increment, INID INT NOT NULL, PID INT NOT NULL, CONSTRAINT FK_INID FOREIGN KEY (INID) REFERENCES INCIDENTS(INID), CONSTRAINT FK_PID FOREIGN KEY (PID) REFERENCES PEOPLE(PID))
CREATE TABLE IF NOT EXISTS INCIDENTS_OBSERVER (IP_ID INT PRIMARY KEY auto_increment, INID INT NOT NULL, PID INT NOT NULL, CONSTRAINT FK_OBSERVER_INID FOREIGN KEY (INID) REFERENCES INCIDENTS(INID), CONSTRAINT FK_OBSERVER_PID FOREIGN KEY (PID) REFERENCES PEOPLE(PID))
CREATE TABLE IF NOT EXISTS INCIDENTS_NOTIFIED ( IP_ID INT PRIMARY KEY auto_increment, INID INT NOT NULL, PID INT NOT NULL, CONSTRAINT FK_NOTIFIED_INID FOREIGN KEY (INID) REFERENCES INCIDENTS(INID), CONSTRAINT FK_NOTIFIED_PID FOREIGN KEY (PID) REFERENCES PEOPLE(PID))
CREATE TABLE IF NOT EXISTS CREDENTIALS (CID INT PRIMARY KEY auto_increment, PID INT NOT NULL, EMAIL VARCHAR(255) NOT NULL, PASSWORD VARCHAR(255) NOT NULL)
INSERT INTO VILLAGES (NAME) VALUES ("Interbay"), ("Whittier"), ("Othello"), ("Camp second chance"), ("Spirit"), ("Lake Union"), ("Plum st"), ("TEMS"), ("True Hope"), ("Georgetown"), ("Northlake");
INSERT INTO PERMISSIONS (ROLE_TYPE) VALUES ('Employee'), ('Admin'), ('Resident');
INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, BIRTHDAY, ROLE_ID, VID, GENDER, EMPLOYMENT, IDENTIFICATION, DISABILITIES, CHILDREN, CRIMINAL_HISTORY) VALUES ("Jennifer", "Smith", "1987-01-12", 3, 1, "F", TRUE, TRUE, FALSE, TRUE, TRUE), ("Sam", "Jackson", "1989-10-12", 3, 2, "M", FALSE, FALSE, TRUE, FALSE, FALSE);
INSERT INTO PEOPLE (FIRST_NAME, LAST_NAME, ROLE_ID) VALUES ("Admin", "LIHI", 2);
INSERT INTO CREDENTIALS (PID, EMAIL, PASSWORD) VALUES (3, "admin@lihi.org", "$2a$10$i20UIxsWH.w9P1lHaH34SudVOHFoaFISbMN0kwE1ClT5jxIRpIJxC");
INSERT INTO HOUSES (HOUSE_NUM, VID, VACANT) VALUES (1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE), (1, 4, TRUE), (1, 5, TRUE), (1, 6, TRUE), (1, 7, TRUE), (1, 8, TRUE), (1, 9, TRUE), (1, 10, TRUE), (1, 11, TRUE);
INSERT INTO RESIDENTS(PID, HOUSE_ID, START_DATE, IN_RESIDENCE) VALUES (1, 1, "2020-01-15", TRUE), (2, 2, "2020-01-15", TRUE);
