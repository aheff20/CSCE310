CREATE TABLE users(
    uin INT,
    first_name VARCHAR,
    last_name VARCHAR,
    m_initial CHAR,
    email VARCHAR,
    discord VARCHAR,
    username VARCHAR,
    pass VARCHAR,
    user_type VARCHAR,
    PRIMARY KEY(uin)

);

CREATE TABLE college_student(
    gender VARCHAR,
    hispanic_latino BOOLEAN,
    race VARCHAR,
    citizen BOOLEAN,
    first_gen BOOLEAN,
    dob DATE,
    gpa FLOAT,
    major VARCHAR,
    minor_1 VARCHAR,
    minor_2 VARCHAR,
    expected_graduation INT,
    school VARCHAR,
    classification VARCHAR,
    student_type VARCHAR,
    phone VARCHAR
) INHERITS(users);

CREATE INDEX username_idx ON users(username);

CREATE VIEW combined_users AS SELECT p.*, c.gender, c.hispanic_latino, c.race, c.citizen, c.first_gen, c.dob, c.gpa, c.major, c.minor_1, c.minor_2, c.expected_graduation, c.school,
 c.classification, c.student_type, c.phone FROM users p LEFT JOIN college_student c ON p.uin = c.uin;

CREATE TABLE classes(
    class_id SERIAL,
    class_name VARCHAR,
    class_description VARCHAR,
    class_type VARCHAR,
    PRIMARY KEY(class_id)
);

CREATE TABLE class_enrollment(
    ce_num SERIAL,
    uin INT,
    class_id INT,
    class_status VARCHAR,
    semester VARCHAR,
    yr INT,
    PRIMARY KEY(ce_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_classes
        FOREIGN KEY(class_id)
            REFERENCES classes(class_id)
);
CREATE INDEX class_idx ON class_enrollment(class_id);
CREATE VIEW user_classes AS SELECT U.uin U.first_name, U.m_initial, U.last_name, UC.ce_num, C.* FROM college_student U JOIN class_enrollment UC ON U.uin = UC.uin JOIN classes C on C.class_id = UC.class_id;

CREATE TABLE internship(
    intern_id SERIAL,
    company_name VARCHAR,
    intern_description VARCHAR,
    is_gov BOOLEAN,
    PRIMARY KEY(intern_id)
);

CREATE TABLE intern_app(
    ia_num SERIAL,
    uin INT,
    intern_id INT,
    intern_status VARCHAR,
    yr INT,
    PRIMARY KEY(ia_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_internship
        FOREIGN KEY(intern_id)
            REFERENCES internship(intern_id)
);
CREATE INDEX intern_idx ON intern_app(intern_id);
CREATE VIEW user_internships AS SELECT U.uin U.first_name, U.m_initial, U.last_name, UI.ia_num, I.* FROM college_student U JOIN intern_app UI ON U.uin = UI.uin JOIN internship I on I.intern_id = UI.intern_id;

CREATE VIEW program_fed_intern_view AS 
SELECT p.program_num, ia.*, i.is_gov, i.location
FROM programs p
JOIN applications a ON p.program_num = a.program_num
JOIN intern_app ia ON a.uin = ia.uin
JOIN internship i ON ia.intern_id = i.intern_id;

CREATE TABLE certification(
    cert_id SERIAL,
    cert_level VARCHAR,
    cert_name VARCHAR,
    cert_description VARCHAR,
    PRIMARY KEY(cert_id)
);

CREATE TABLE programs(
    program_num SERIAL,
    program_name VARCHAR UNIQUE,
    program_description VARCHAR,
    active BOOLEAN,
    PRIMARY KEY(program_num)
);

CREATE TABLE cert_enrollment(
    certe_num SERIAL,
    uin INT,
    cert_id INT,
    cert_status VARCHAR,
    training_status VARCHAR,
    program_num INT,
    semester VARCHAR,
    yr INT,
    PRIMARY KEY(certe_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_certification
        FOREIGN KEY(cert_id)
            REFERENCES certification(cert_id),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);
CREATE INDEX cert_idx ON cert_enrollment(cert_id);
CREATE VIEW user_certifications AS SELECT U.uin, U.first_name, U.m_initial, U.last_name, UC.certe_num, C.* FROM college_student U JOIN cert_enrollment UC ON U.uin = UC.uin JOIN certification C on C.cert_id = UC.cert_id;
CREATE VIEW program_certifications AS SELECT P.program_num, C.* FROM programs P JOIN cert_enrollment PC ON P.program_num = PC.program_num JOIN certification C on C.cert_id = PC.cert_id;

CREATE TABLE event(
    event_id SERIAL,
    event_name TEXT,
    uin INT,
    program_num INT,
    event_start_date DATE,
    event_end_date DATE,
    event_time TIME,
    event_location VARCHAR,
    event_type VARCHAR,
    PRIMARY KEY(event_id),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES users(uin),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);

CREATE INDEX event_id_idx ON event_tracking(event_id);

CREATE VIEW attending_users AS SELECT E.event_id, U.* FROM event E JOIN event_tracking ET ON E.event_id = ET.event_ID JOIN users U on ET.uin = U.uin;

CREATE TABLE event_tracking(
    et_num SERIAL,
    event_id INT,
    uin INT,
    PRIMARY KEY(et_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_event
        FOREIGN KEY(event_id)
            REFERENCES event(event_id)
);

CREATE TABLE applications(
    app_num SERIAL,
    program_num INT,
    uin INT,
    uncom_cert VARCHAR,
    com_cert VARCHAR,
    purpose_statement VARCHAR,
    PRIMARY KEY(app_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);
CREATE INDEX idx_applications_uin ON applications(uin);

CREATE TABLE documentation(
    doc_num SERIAL,
    app_num INT,
    link VARCHAR,
    doc_type VARCHAR,
    PRIMARY KEY(doc_num),
    CONSTRAINT fk_applications
        FOREIGN KEY(app_num)
            REFERENCES applications(app_num)
);

CREATE TABLE track(
    track_num SERIAL,
    uin INT,
    program_num INT,
    PRIMARY KEY(track_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES college_student(uin),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);

