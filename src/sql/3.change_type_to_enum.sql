DO
$$
DECLARE
    err_msg TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 3) THEN
        RAISE NOTICE 'Schema version 3 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        ALTER TABLE problems DROP COLUMN difficulty;
        ALTER TABLE problems ADD COLUMN difficulty problem_difficulty;

        INSERT INTO schema_version (version) VALUES (3);
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
            RAISE NOTICE 'An error occurred. Transaction rolled back. Error: %', err_msg;
            ROLLBACK;
    END;
END
$$;