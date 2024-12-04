mod handlers;
mod model;
mod repository;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use env_logger::Env;
use handlers::handlers::{
    get_anonymous, get_user, get_user_history, login_user, post_game, register_user,
};
use repository::database::create_pg_pool;
use std::error::Error;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error>> {
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    let pool = create_pg_pool().await;

    sqlx::migrate!("./migrations").run(&pool).await?;
    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST"])
                    .allow_any_header()
                    .max_age(36000),
            )
            .app_data(web::Data::new(pool.clone()))
            .service(register_user)
            .service(login_user)
            .service(post_game)
            .service(get_anonymous)
            .service(get_user)
            .service(get_user_history)
    })
    // .bind(("127.0.0.1", 8080))? // local testing
    .bind(("0.0.0.0", 8080))?
    .run()
    .await?;

    Ok(())
}
