DO
$$
DECLARE
    err_msg TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 7) THEN
        RAISE NOTICE 'Schema version 7 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        ALTER TABLE problems DROP COLUMN tags;
        ALTER TABLE problems ADD COLUMN problem_group TEXT;

        INSERT INTO schema_version (version) VALUES (7);
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
            RAISE NOTICE 'An error occurred. Transaction rolled back. Error: %', err_msg;
            ROLLBACK;
    END;
END
$$;