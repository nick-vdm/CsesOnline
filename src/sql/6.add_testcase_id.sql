DO
$$
DECLARE
    err_msg TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 6) THEN
        RAISE NOTICE 'Schema version 6 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN
        -- issue is the folder with testcases is stored separately
        ALTER TABLE problems ADD COLUMN tests_id VARCHAR(255);
        INSERT INTO schema_version (version) VALUES (6);
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT;
            RAISE NOTICE 'An error occurred. Transaction rolled back. Error: %', err_msg;
            ROLLBACK;
    END;
END
$$;