
DO
$$
DECLARE
    err_msg TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 5) THEN
        RAISE NOTICE 'Schema version 5 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        ALTER TABLE problems ADD COLUMN problem_link TEXT;

        INSERT INTO schema_version (version) VALUES (5);
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
            RAISE NOTICE 'An error occurred. Transaction rolled back. Error: %', err_msg;
            ROLLBACK;
    END;
END
$$;