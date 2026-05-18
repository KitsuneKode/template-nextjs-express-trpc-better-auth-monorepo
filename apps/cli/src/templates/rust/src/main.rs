use axum::{routing::get, Router};
use tower_http::cors::{Any, CorsLayer};
use tracing::info;

mod config;
mod routes;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    dotenvy::dotenv().ok();

    let config = config::Config::from_env();

    let cors = CorsLayer::new()
        .allow_origin(
            config
                .frontend_url
                .parse::<axum::http::HeaderValue>()
                .ok()
                .map(|v| [v])
                .unwrap_or_default(),
        )
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(routes::health))
        .layer(cors);

    let addr = format!("0.0.0.0:{}", config.port);
    info!("Server listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
