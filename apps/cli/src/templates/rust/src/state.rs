use std::sync::Arc;

use sqlx::PgPool;

use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
    pub db: Option<Arc<PgPool>>,
}

impl AppState {
    pub fn new(config: Config, db: Option<PgPool>) -> Self {
        Self {
            config,
            db: db.map(Arc::new),
        }
    }
}
