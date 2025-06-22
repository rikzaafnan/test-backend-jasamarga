-- GET ALL EMPLOYEE
SELECT
    e.id as id, e.nik as nik, e.name as name, e.is_active as is_active,
    TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date
FROM
    employee e
WHERE
    1 = 1 

-- GET One EMPLOYEE by ID
WITH educations_cte AS (
    SELECT
        ed.employee_id,
        json_agg(jsonb_build_object(
            'id', ed.id,
            'name', ed.name,
            'level', ed.level,
            'description', ed.description,
            'created_at', TO_CHAR(ed.created_at, 'YYYY-MM-DD'),
            'updated_at', TO_CHAR(ed.updated_at, 'YYYY-MM-DD')
        )) AS educations
    FROM education ed
    GROUP BY ed.employee_id
),
families_cte AS (
    SELECT
        ef.employee_id,
        json_agg(jsonb_build_object(
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
        )) AS families
    FROM employee_family ef
    GROUP BY ef.employee_id
)
SELECT
    e.id,
    e.nik,
    e.name,
    e.is_active,
    TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,
    TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date,
    e.deleted_at,
    e.deleted_by,
    ep.id AS employee_profile_id,
    ep.place_of_birth,
    TO_CHAR(ep.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
    ep.gender,
    ep.is_married,
    ep.prof_pict,
    TO_CHAR(ep.created_at, 'YYYY-MM-DD') AS created_at,
    TO_CHAR(ep.updated_at, 'YYYY-MM-DD') AS updated_at,
    ep.created_by,
    ep.updated_by,
    COALESCE(ed.educations, '[]') AS educations,
    COALESCE(fa.families, '[]') AS families

FROM employee e
JOIN employee_profile ep ON ep.employee_id = e.id
LEFT JOIN educations_cte ed ON ed.employee_id = e.id
LEFT JOIN families_cte fa ON fa.employee_id = e.id
WHERE e.id = ?

-- Update One EMPLOYEE by ID
BEGIN;

WITH educations_cte AS (
    SELECT
        ed.employee_id,
        json_agg(jsonb_build_object(
            'id', ed.id,
            'name', ed.name,
            'level', ed.level,
            'description', ed.description,
            'created_at', TO_CHAR(ed.created_at, 'YYYY-MM-DD'),
            'updated_at', TO_CHAR(ed.updated_at, 'YYYY-MM-DD')
        )) AS educations
    FROM education ed
    GROUP BY ed.employee_id
),
families_cte AS (
    SELECT
        ef.employee_id,
        json_agg(jsonb_build_object(
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
        )) AS families
    FROM employee_family ef
    GROUP BY ef.employee_id
)
SELECT
    e.id,
    e.nik,
    e.name,
    e.is_active,
    TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,
    TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date,
    e.deleted_at,
    e.deleted_by,
    ep.id AS employee_profile_id,
    ep.place_of_birth,
    TO_CHAR(ep.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
    ep.gender,
    ep.is_married,
    ep.prof_pict,
    TO_CHAR(ep.created_at, 'YYYY-MM-DD') AS created_at,
    TO_CHAR(ep.updated_at, 'YYYY-MM-DD') AS updated_at,
    ep.created_by,
    ep.updated_by,
    COALESCE(ed.educations, '[]') AS educations,
    COALESCE(fa.families, '[]') AS families

FROM employee e
JOIN employee_profile ep ON ep.employee_id = e.id
LEFT JOIN educations_cte ed ON ed.employee_id = e.id
LEFT JOIN families_cte fa ON fa.employee_id = e.id
WHERE e.id = ?

UPDATE 
    employee
SET
    nik = ?,
    name = ?,
    is_active = ?,
    start_date = ?,
    end_date = ?,
    updated_by = ?,
    updated_at = ?
WHERE 
    id = ?; 
UPDATE 
    employee_profile
SET
    place_of_birth = ?,
    date_of_birth =?,
    gender = ?,
    is_married = ?,
    prof_pict = ?,
    updated_by = ?,
    updated_at =?
WHERE 
    employee_id = ?; 

UPDATE 
    education
SET
    deleted_by = ?,
    deleted_at = ?
WHERE 
    employee_id = ?; 

INSERT INTO education (
                    employee_id,
                    name,
                    level,
                    description,
                    created_by,
                    updated_by
                ) VALUES (?, ?, ?, ?, ?, ?);

UPDATE 
    employee_family
SET
    deleted_by = ?,
    deleted_at = ?
WHERE 
    employee_id = ?; 
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

-- Delete One EMPLOYEE by ID in case delete is soft delete
UPDATE 
    employee
SET
    deleted_by = ?,
    deleted_at = ?
WHERE 
    id = ?

-- Insert One EMPLOYEE with db transaction
BEGIN;
INSERT INTO employee (nik, name, is_active, start_date, end_date, created_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id;;
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

            
