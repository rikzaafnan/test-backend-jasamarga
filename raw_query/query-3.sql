INSERT INTO employee 
        (nik, name, is_active, start_date, end_date)
      VALUES 
        ('11012', 'Budi', true, '2022-12-12', '2029-12-12'),
        ('11013', 'Jarot', true, '2020-05-10', '2028-09-01');

INSERT INTO employee_profile
        (employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'Jakarta', '1997-05-02', 'Laki-Laki', true, NULL, 'admin', 'admin', '2022-12-12','2022-12-12'),
        (2, 'Sukabumi', '1997-05-02', 'Laki-Laki', false, NULL, 'admin', 'admin', '2022-12-12', '2022-12-12');

INSERT INTO education
        (employee_id, name, level, description, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'SMKN 7 JAKARTA', 'Sma', 'Sekolah Menengah Atas', 'admin', 'admin', '2022-12-12', '2022-12-12'),
        (2, 'Universitas Neegri Jakarta', 'Strata 1', 'Sarjana', 'admin', 'admin', '2022-12-12', '2022-12-12');

INSERT INTO employee_family
        (employee_id, name, identifier, job, place_of_birth, date_of_birth, religion, is_life, is_divorced, relation_status, created_by, updated_by, created_at, updated_at)
      VALUES 
        (1, 'Marni', '1000001', 'Ibu Rumah Tangga','Denpasar', '1995-10-13', 'Islam', true, false, 'Istri', 'admin', 'admin', '2022-12-12', '2022-12-12'),
        (1, 'Dana', '1000002', 'Pelajar','Bangkalan', '2006-10-13', 'Islam', true, false, 'Anak', 'admin', 'admin', '2022-12-12','2022-12-12'),
        (1, 'Sourvenir', '1000003', 'Pelajar','Bangkalan', '2008-10-13', 'Islam', true, false, 'Anak', 'admin', 'admin', '2022-12-12', '2022-12-12');