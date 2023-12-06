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

CREATE TABLE classes(
    class_id INT,
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
            REFERENCES users(uin),
    CONSTRAINT fk_classes
        FOREIGN KEY(class_id)
            REFERENCES classes(class_id)
);

CREATE TABLE internship(
    intern_id INT,
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
            REFERENCES users(uin),
    CONSTRAINT fk_internship
        FOREIGN KEY(intern_id)
            REFERENCES internship(intern_id)
);

CREATE TABLE certification(
    cert_id INT,
    cert_level VARCHAR,
    cert_name VARCHAR,
    cert_description VARCHAR,
    PRIMARY KEY(cert_id)
);

CREATE TABLE programs(
    program_num SERIAL,
    program_name VARCHAR UNIQUE,
    program_description VARCHAR,
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
            REFERENCES users(uin),
    CONSTRAINT fk_certification
        FOREIGN KEY(cert_id)
            REFERENCES certification(cert_id),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);

CREATE TABLE event(
    event_id SERIAL,
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

CREATE TABLE event_tracking(
    et_num SERIAL,
    event_id INT,
    uin INT,
    PRIMARY KEY(et_num),
    CONSTRAINT fk_user
        FOREIGN KEY(uin)
            REFERENCES users(uin),
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
            REFERENCES users(uin),
    CONSTRAINT fk_programs
            FOREIGN KEY(program_num)
                REFERENCES programs(program_num)
);

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