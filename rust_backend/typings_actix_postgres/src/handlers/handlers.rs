use actix_web::{
    get, post,
    web::{self, Json},
    HttpResponse, Responder,
};
use serde::{Deserialize, Serialize};

use crate::{
    model::user::{self, NewUser},
    repository::database::{create_user, UserError},
};

#[derive(Deserialize, Serialize)]
pub struct CreateUserRequest {
    user_name: String,
    user_passwd_hash: String,
}

#[post("/register")]
pub async fn register_user(
    request: Json<CreateUserRequest>,
    pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    // Return type is impl Responder
    let new_user = NewUser {
        name: request.user_name.clone(),
        passwd_hash: request.user_passwd_hash.clone(),
    };

    match create_user(new_user, pool.get_ref()).await {
        // Use pool.get_ref() to pass the pool reference
        Ok(_) => HttpResponse::Created().finish(),
        Err(_) => HttpResponse::NotFound().body(UserError::UserCreationFailed.to_string()), // Use to_string() for the error message
    }
}
