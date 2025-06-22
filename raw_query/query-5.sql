-- GET ALL EMPLOYEE
SELECT
    e.id as id, e.nik as nik, e.name as name, e.is_active as is_active,
    TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date
FROM
    employee e
WHERE
    1 = 1 

-- GET One EMPLOYEE by ID
SELECT
    e.id as id, e.nik as nik, e.name as name, e.is_active as is_active,
    TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date,
    ep.id as employee_profile_id, ep.place_of_birth as place_of_birth, TO_CHAR(ep.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
    ep.gender as gender, ep.is_married as is_married,ep.prof_pict as prof_pict,TO_CHAR(ep.created_at, 'YYYY-MM-DD') as created_at,TO_CHAR(ep.updated_at, 'YYYY-MM-DD') as updated_at,ep.created_by as created_by,ep.updated_by as updated_by,
    COALESCE(
        json_agg(
            jsonb_build_object(
                'id', ed.id,
                'name', ed.name,
                'level', ed.level,
                'description', ed.description,
                'created_at', TO_CHAR(ed.created_at, 'YYYY-MM-DD'),
                'updated_at', TO_CHAR(ed.updated_at, 'YYYY-MM-DD')
            )
        ) FILTER (WHERE ed.id IS NOT NULL),
        '[]'
    ) AS educations,
    COALESCE(
        json_agg(
            jsonb_build_object(
                'id', ef.id,
                'name', ef.name,
                'identifier', ef.identifier,
                'job', ef.job,
                'religion', ef.religion,
                'is_life', ef.is_life,
                'is_divorced', ef.is_divorced,
                'relation_status', ef.relation_status,
                'place_of_birth', ef.place_of_birth,
                'date_of_birth', TO_CHAR(ef.date_of_birth, 'YYYY-MM-DD'),
                'created_at', TO_CHAR(ef.created_at, 'YYYY-MM-DD'),
                'updated_at', TO_CHAR(ef.updated_at, 'YYYY-MM-DD')
            )
        ) FILTER (WHERE ef.id IS NOT NULL),
        '[]'
    ) AS families
FROM
    employee e
JOIN 
    employee_profile ep ON e.id = ep.employee_id
LEFT JOIN
    education ed ON e.id = ed.employee_id
LEFT JOIN
    employee_family ef ON e.id = ef.employee_id
WHERE
    e.id = ?
GROUP BY
    e.id, ep.id

-- Update One EMPLOYEE by ID

-- Delete One EMPLOYEE by ID

-- Insert One EMPLOYEE
-- with db transaction
BEGIN;
INSERT INTO employee (nik, name, is_active, start_date, end_date, created_by)
VALUES (?, ?, ?, ?, ?, ?);
INSERT INTO 
                employee_profile
            ( employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict, created_by )
                VALUES (
                        ?, ?, ?,?, ?, ?, ?
                    ) ;

INSERT INTO education (
                    employee_id,
                    name,
                    level,
                    description,
                    created_by,
                    updated_by
                ) VALUES (?, ?, ?, ?, ?, ?);

INSERT INTO employee_family (
                    employee_id,
                    name,
                    identifier,
                    job,
                    place_of_birth,
                    date_of_birth,
                    religion,
                    is_life,
                    is_divorced,
                    relation_status,
                    created_by,
                    updated_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
COMMIT;

            
