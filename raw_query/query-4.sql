 WITH top_education AS (
            SELECT DISTINCT ON (ed.employee_id)
                ed.employee_id,
                ed.name AS school_name,
                ed.level
            FROM education ed
            WHERE ed.deleted_at IS NULL
            AND ed.deleted_by IS NULL
            ORDER BY ed.employee_id, ed.created_at ASC
        ),
        families_summary AS (
            SELECT
                ef.employee_id,
                COUNT(*) FILTER (WHERE ef.relation_status = 'Istri') AS jumlah_istri,
                COUNT(*) FILTER (WHERE ef.relation_status = 'Anak') AS jumlah_anak
            FROM employee_family ef
            WHERE ef.deleted_at IS NULL
            AND ef.deleted_by IS NULL
            GROUP BY ef.employee_id
        )

        SELECT
            e.id AS employee_id,
            e.nik,
            e.name,
            e.is_active,
            ep.gender,
            EXTRACT(YEAR FROM age(ep.date_of_birth))::int || ' years old' AS age,
            te.school_name,
            te.level,
            CASE
                WHEN fs.employee_id IS NULL THEN '–'
                ELSE 
                    COALESCE(fs.jumlah_istri, 0)::TEXT || ' istri dan ' || COALESCE(fs.jumlah_anak, 0)::TEXT || ' anak'
            END AS keluarga

        FROM employee e
        JOIN employee_profile ep ON ep.employee_id = e.id
        LEFT JOIN top_education te ON te.employee_id = e.id
        LEFT JOIN families_summary fs ON fs.employee_id = e.id

        WHERE 
            e.deleted_at IS NULL
        AND 
            e.deleted_by IS NULL;