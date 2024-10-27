mod handlers;
mod model;
mod repository;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use handlers::handlers::{login_user, post_game, register_user};
use model::{
    game::{Game, NewGame},
    user::UserAuth,
};
use repository::database::{create_pg_pool, create_user, get_user, update_history};
use sqlx::types::Uuid;
use std::{error::Error, str::FromStr};

#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error>> {
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    let pool = create_pg_pool().await;

    sqlx::migrate!("./migrations").run(&pool).await?;

    // CREATE USER
    // let user = NewUser::new("katzos".to_string(), "hashPasswd".to_string());
    // let res = create_user(user, &pool).await;
    //
    // match &res {
    //     Ok(_) => {}
    //     Err(e) => println!("User creation failed: {:}", e),
    // }

    // GET USER
    // let res = get_user("katzos".to_string(), &pool).await;

    // match &res {
    //     Ok(_) => {
    //         print!("{:?}", res.unwrap());
    //     }
    //     Err(e) => println!("No user returned: {:?}", e),
    // }

    let game = NewGame::new(
        Uuid::from_str("c7c1a005-4091-4f76-9b01-f151a6e16663").unwrap(),
        105.0,
        60,
    );

    let res = update_history(game, &pool).await;
    match &res {
        Ok(_) => {
            println!("Game Registered Successfully")
        }
        Err(e) => println!("Game NOT Registered: {:?}", e),
    }

    HttpServer::new(move || {
        App::new().wrap(
            Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "PUT"])
            .allow_any_header()
            .max_age(36000)
        )
            .app_data(web::Data::new(pool.clone()))
            .service(register_user)
            .service(login_user)
            .service(post_game)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await?;

    Ok(())
}
