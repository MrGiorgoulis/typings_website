use std::str::FromStr;

use actix_web::{
    get, post,
    web::{self, Json},
    HttpResponse, Responder,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::types::Uuid;


use crate::{
    model::{game::NewGame, user::UserAuth},
    repository::database::{create_user, get_user, update_history},
};

#[derive(Deserialize, Serialize)]
pub struct UserRequest {
    user_name: String,
    user_passwd_hash: String,
}

#[derive(Deserialize, Serialize)]
pub struct PostGameRequest{
    user_uuid: String, 
    wpm: f64,
    time: i32,
}


#[get("/login")]
pub async fn login_user(
    query: web::Query<UserRequest>, // Use query extractor
    pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    println!("{:?}            {:?}",&query.user_name, &query.user_passwd_hash);
    match get_user(query.user_name.clone(), query.user_passwd_hash.clone(), &pool).await {
        Ok(user) => {
            let response_body = json!({
                "uuid": user.uuid.to_string(),
                "name": user.name,
                "total_games": user.total_games,
                "wpm_avg": user.wpm_avg,
                "wpm_best": user.wpm_best,
                "created_at": user.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
                "role": user.role,
            });
            HttpResponse::Accepted().json(response_body)
        },
        Err(_) => HttpResponse::NotAcceptable().body("User name or password is not correct"),
    }
}


#[post("/register")]
pub async fn register_user(
    request: Json<UserRequest>,
    pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    // Return type is impl Responder
    let new_user = UserAuth::new(request.user_name.clone(), request.user_passwd_hash.clone());

    match create_user(&new_user, pool.get_ref()).await {
        Ok(_) => match get_user(new_user.name.clone(), new_user.passwd_hash.clone(), pool.get_ref()).await {
            Ok(user) => {
                // Convert `Uuid` and `NaiveDateTime` to strings in the response payload
                let response_body = json!({
                    "uuid": user.uuid.to_string(),
                    "name": user.name,
                    "total_games": user.total_games,
                    "wpm_avg": user.wpm_avg,
                    "wpm_best": user.wpm_best,
                    "created_at": user.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
                    "role": user.role,
                });
                println!("{:?}", response_body);
                HttpResponse::Created().json(response_body)
            },
            Err(_) => HttpResponse::InternalServerError().body("User retrieval failed after creation"),
        },
        Err(_) => HttpResponse::Conflict().body("User creation failed"),
    }
}

#[post("/post_game")]
pub async fn post_game(request: Json<PostGameRequest>,
    pool: web::Data<sqlx::PgPool>,) 
-> impl Responder {


    let new_game = NewGame::new(Uuid::from_str(&request.user_uuid).unwrap(),  request.wpm, request.time);

    match update_history(new_game, &pool).await {
        Ok(_) => HttpResponse::Created().body("Game Registered Successfully"),
        Err(e) => HttpResponse::BadRequest().body("Failed to Register Game") 
    }

}