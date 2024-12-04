use chrono::NaiveDateTime;
use serde::de::value::Error;
use serde::Serialize;
use sqlx::postgres::{PgPoolOptions, PgRow};
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres, Row};
use strum::Display;

use crate::handlers::handlers::GameHistory;
use crate::model::game::NewGame;
use crate::model::user::{User, UserAuth};

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
    // let database_url = "postgres://postgres:postgres@db:5432/typings_users";
    let database_url = "postgres://postgres:postgres@127.0.0.1:5432/typings_users"; // local testing

    // let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Failed to create pool")
}
pub async fn create_user(user: &UserAuth, pool: &sqlx::PgPool) -> Result<(), UserError> {
    let query = "INSERT INTO users (user_name, password_hash) VALUES ($1, $2)";
    let res = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.passwd_hash)
        .execute(pool)
        .await;

    match res {
        Ok(_) => {
            println!("{:?}", res);
            Ok(())
        }
        Err(_) => Err(UserError::UserCreationFailed),
    }
}

pub async fn get_user_by_name(
    user_name: String,
    user_passswd_hash: String,
    pool: &sqlx::PgPool,
) -> Result<User, UserError> {
    let q = "SELECT * FROM users WHERE user_name = $1 AND password_hash = $2";
    let query = sqlx::query(q).bind(user_name).bind(user_passswd_hash);
    let row = query.fetch_one(pool).await;

    match row {
        Ok(_) => {
            println!("USER RETRIEVED");
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
        Err(_) => {
            println!("USresER NOT RETRIEVED");
            Err(UserError::UserNotFound)
        }
    }
}

pub async fn get_user_by_uuid(user_uuid: Uuid, pool: &sqlx::PgPool) -> Result<User, UserError> {
    let q = "SELECT * FROM users WHERE user_uuid = $1";
    let query = sqlx::query(q).bind(user_uuid);
    let row = query.fetch_one(pool).await;

    match row {
        Ok(_) => {
            println!("USER RETRIEVED");
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
        Err(_) => {
            println!("USER NOT RETRIEVED");
            Err(UserError::UserNotFound)
        }
    }
}

pub async fn update_history(game: NewGame, pool: &sqlx::PgPool) -> Result<(), GameError> {
    let query = "INSERT INTO game_history (user_uuid, WPM, time) VALUES ($1, $2, $3)";
    println!("{:?} {:?} {:?}", game.user_uuid, game.wpm, game.time);
    println!("{}", game.time / 10.0);
    let res = sqlx::query(query)
        .bind(game.user_uuid)
        .bind(game.wpm)
        .bind(game.time / 10.0)
        .execute(pool)
        .await;

    match res {
        Ok(_) => {
            match update_stats(game, pool).await {
                Ok(_) => {}
                Err(e) => {
                    eprintln! {"Error updating user stats: {}", e}
                }
            }
            Ok(())
        }
        Err(_) => Err(GameError::GameNotRegistered),
    }
}

pub async fn get_history_by_uuid(
    uuid: Uuid,
    limit: i32,
    page: i32,
    pool: &sqlx::PgPool,
) -> Result<Vec<GameHistory>, sqlx::Error> {
    let query = "
                SELECT * FROM game_history 
                WHERE user_uuid = $1 
                ORDER BY game_number DESC
                LIMIT $2 
                OFFSET $3;
            ";

    let history = sqlx::query_as::<_, GameHistory>(query)
        .bind(uuid)
        .bind(limit)
        .bind(page * limit)
        .fetch_all(pool)
        .await;
    println!("{:?}", history);

    Ok(history.unwrap())
}

pub async fn update_stats(game: NewGame, pool: &sqlx::PgPool) -> Result<(), GameError> {
    let active_user = get_user_by_uuid(game.user_uuid, pool).await;

    match active_user {
        Ok(user) => {
            let new_wpm_average =
                (user.wpm_avg * user.total_games as f64 + game.wpm) / (user.total_games + 1) as f64;
            println!("{}", new_wpm_average);
            let new_total = user.total_games + 1;
            let new_wpm_best;
            if user.wpm_best < game.wpm {
                new_wpm_best = game.wpm;
            } else {
                new_wpm_best = user.wpm_best;
            }

            let query = "
                UPDATE users 
                SET 
                    wpm_average = $1 ,
                    total_games = $2,
                    wpm_best = $3
                WHERE user_uuid = $4
            ";
            let res = sqlx::query(query)
                .bind(new_wpm_average)
                .bind(new_total)
                .bind(new_wpm_best)
                .bind(game.user_uuid)
                .execute(pool)
                .await;

            println!("{:?}", res);
            match res {
                Ok(_) => Ok(()),
                Err(_) => Err(GameError::GameNotRegistered),
            }
        }
        Err(_) => Err(GameError::GameNotRegistered),
    }
}
