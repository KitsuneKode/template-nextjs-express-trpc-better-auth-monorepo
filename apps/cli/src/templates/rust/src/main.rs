mod app;
mod config;
mod db;
mod error;
mod middleware;
mod modules;
mod state;

#[tokio::main]
async fn main() {
    if let Err(err) = app::run().await {
        tracing::error!(error = %err, "server exited with error");
        std::process::exit(1);
    }
}
