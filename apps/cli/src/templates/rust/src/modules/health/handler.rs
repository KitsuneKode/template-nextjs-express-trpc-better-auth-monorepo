use axum::Json;
use serde_json::{json, Value};

use crate::error::AppError;

pub async fn health() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({ "status": "ok" })))
}
