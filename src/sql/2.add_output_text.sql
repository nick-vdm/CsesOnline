DO
$$
BEGIN
    IF EXISTS (SELECT 1 FROM schema_version WHERE version = 2) THEN
        RAISE NOTICE 'Schema version 2 exists. Exiting.';
        RETURN;
    END IF;

    BEGIN

        ALTER TABLE submissions add column output_text TEXT;
        ALTER TABLE submissions add column error_text TEXT;

        INSERT INTO schema_version (version) VALUES (2);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE NOTICE 'An error occurred. Transaction rolled back.';
    END;
END
$$;