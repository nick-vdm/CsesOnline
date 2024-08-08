DO
$$
DECLARE
    err_msg TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 4) THEN
        RAISE NOTICE 'Schema version 4 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        ALTER TABLE problems DROP COLUMN problem_description;
        ALTER TABLE problems ADD COLUMN problem_description TEXT;

        INSERT INTO schema_version (version) VALUES (4);
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
            RAISE NOTICE 'An error occurred. Transaction rolled back. Error: %', err_msg;
            ROLLBACK;
    END;
END
$$;