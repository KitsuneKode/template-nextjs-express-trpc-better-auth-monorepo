//! Placeholder auth — replace with real session/JWT validation.

use axum::http::Request;
use uuid::Uuid;

#[derive(Clone, Debug)]
pub struct CurrentUser {
    pub id: Uuid,
}

/// Demo extractor: returns a fixed user when `Authorization: Bearer demo` is present.
pub fn current_user_from_headers<B>(req: &Request<B>) -> Option<CurrentUser> {
    let auth = req.headers().get("authorization")?.to_str().ok()?;
    if auth == "Bearer demo" {
        return Some(CurrentUser {
            id: Uuid::parse_str("00000000-0000-0000-0000-000000000001").ok()?,
        });
    }
    None
}
