use chrono::NaiveDateTime;
use sqlx::types::Uuid;

#[derive(Debug)]
pub struct User {
    pub uuid: Uuid,
    pub name: String,
    pub total_games: i32,
    pub wpm_avg: f64,
    pub wpm_best: f64,
    pub passwd_hash: String,
    pub created_at: NaiveDateTime,
    pub role: String,
}

pub struct UserAuth {
    pub name: String,
    pub passwd_hash: String,
}

impl UserAuth {
    pub fn new(name: String, passwd_hash: String) -> UserAuth {
        UserAuth { name, passwd_hash }
    }
}

impl User {
    pub fn new(
        uuid: Uuid,
        name: String,
        total_games: i32,
        wpm_avg: f64,
        wpm_best: f64,
        passwd_hash: String,
        created_at: NaiveDateTime,
        role: String,
    ) -> User {
        User {
            uuid,
            name,
            total_games,
            wpm_avg,
            wpm_best,
            passwd_hash,
            created_at,
            role,
        }
    }
}
