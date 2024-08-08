DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 1) THEN
        RAISE NOTICE 'Schema version 1 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        CREATE TYPE problem_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');

        CREATE TABLE problems (
            id SERIAL PRIMARY KEY,
            version INT NOT NULL DEFAULT 1,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            lastupdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            title VARCHAR(255) NOT NULL,
            difficulty VARCHAR(50) NOT NULL,
            markdown_text TEXT NOT NULL,
            tags TEXT[]
        );

        CREATE TYPE submission_status AS ENUM ('PENDING', 'ACCEPTED', 'FAILED');

        CREATE TABLE submissions (
            id SERIAL PRIMARY KEY,
            version INT NOT NULL DEFAULT 1,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            lastupdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            program_lang VARCHAR(50) NOT NULL,
            code TEXT NOT NULL,
            linked_user INT NOT NULL REFERENCES users(id),
            problem_id INT NOT NULL REFERENCES problems(id),
            status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
            result TEXT,
            result_time_ms INT,
            result_memory_kb INT
        );

        INSERT INTO schema_version (version) VALUES (1);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE NOTICE 'An error occurred. Transaction rolled back.';
    END;
END
$$;