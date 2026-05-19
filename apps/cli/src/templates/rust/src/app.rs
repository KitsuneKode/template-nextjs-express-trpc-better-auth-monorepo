use axum::Router;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing_subscriber::EnvFilter;

use crate::config::Config;
use crate::db::pool;
use crate::error::AppError;
use crate::modules;
use crate::state::AppState;

pub async fn run() -> Result<(), AppError> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info,__CRATE_NAME__=debug")),
        )
        .init();

    let config = Config::from_env();
    let db = pool::connect(&config).await?;
    let state = AppState::new(config.clone(), db);

    let app = build_router(state);

    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!(%addr, "listening");

    let listener = tokio::net::TcpListener::bind(&addr).await.map_err(|e| {
        AppError::Internal(format!("bind {addr}: {e}"))
    })?;

    axum::serve(listener, app).await.map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(())
}

pub fn build_router(state: AppState) -> Router {
    Router::new()
        .merge(modules::health::routes::router())
        .merge(modules::posts::routes::router())
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_methods(Any)
                .allow_headers(Any)
                .allow_origin(Any),
        )
        .with_state(state)
}
