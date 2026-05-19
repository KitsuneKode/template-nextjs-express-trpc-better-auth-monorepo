use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub port: u16,
    pub database_url: Option<String>,
}

impl Config {
    pub fn from_env() -> Self {
        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(3001);

        let database_url = env::var("DATABASE_URL").ok().filter(|s| !s.is_empty());

        Self { port, database_url }
    }
}
