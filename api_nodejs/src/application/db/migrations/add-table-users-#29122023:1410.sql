

CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `email` varchar(255) NOT NULL,
                         `password` varchar(255) NOT NULL,
                         `remember_token` varchar(1000) DEFAULT NULL,
                         `public_id` varchar(100) DEFAULT NULL,
                         `username` varchar(255) NOT NULL,
                         `avatar` varchar(255) DEFAULT NULL,
                         `model_id` varchar(30) DEFAULT NULL,
                         `model_type` varchar(255) DEFAULT NULL,
                         `user_type` varchar(20) DEFAULT NULL,
                         `session_id` longtext DEFAULT NULL,
                         `is_active` tinyint(1) DEFAULT NULL,
                         `is_delete` tinyint(1) DEFAULT NULL,
                         `last_login` datetime(3) DEFAULT NULL,
                         `created_at` datetime(3) DEFAULT NULL,
                         `updated_at` datetime(3) DEFAULT NULL,
                         `deleted_at` datetime(3) DEFAULT NULL,
                         `created_by` int(11) DEFAULT NULL,
                         `updated_by` int(11) DEFAULT NULL,
                         `deleted_by` int(11) DEFAULT NULL,
                         `refresh_token` varchar(255) NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB;


