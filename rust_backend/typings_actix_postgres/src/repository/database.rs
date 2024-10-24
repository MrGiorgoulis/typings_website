use chrono::NaiveDateTime;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres, Row};
use std::env;
use strum::Display;

use crate::model::game::NewGame;
use crate::model::user::{NewUser, User};

#[derive(Debug, Display)]
pub enum UserError {
    UserNotFound,
    UserCreationFailed,
}

#[derive(Debug, Display)]
pub enum GameError {
    GameNotRegistered,
}

pub async fn create_pg_pool() -> Pool<Postgres> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Failed to create pool")
}
pub async fn create_user(user: NewUser, pool: &sqlx::PgPool) -> Result<(), UserError> {
    let query = "INSERT INTO users (user_name, password_hash) VALUES ($1, $2)";
    let res = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.passwd_hash)
        .execute(pool)
        .await;

    match res {
        Ok(_) => Ok(()),
        Err(_) => Err(UserError::UserCreationFailed),
    }
}

pub async fn get_user(user_name: String, pool: &sqlx::PgPool) -> Result<User, UserError> {
    let q = "SELECT * FROM users WHERE user_name = $1";
    let query = sqlx::query(q).bind(user_name);
    let row = query.fetch_one(pool).await;

    match row {
        Ok(_) => {
            let row = row.unwrap();
            let user = User::new(
                row.get::<Uuid, _>("user_uuid"),
                row.get("user_name"),
                row.get("total_games"),
                row.get("wpm_average"),
                row.get("wpm_best"),
                row.get("password_hash"),
                row.get::<NaiveDateTime, _>("created_at"),
                row.get("role"),
            );
            Ok(user)
        }
        Err(_) => Err(UserError::UserNotFound),
    }
}

pub async fn update_history(game: NewGame, pool: &sqlx::PgPool) -> Result<(), GameError> {
    let query = "INSERT INTO game_history (user_uuid, WPM, time) VALUES ($1, $2, $3)";
    let res = sqlx::query(query)
        .bind(game.user_uuid)
        .bind(game.wpm)
        .bind(game.time)
        .execute(pool)
        .await;

    match res {
        Ok(_) => Ok(()),
        Err(_) => Err(GameError::GameNotRegistered),
    }
}
