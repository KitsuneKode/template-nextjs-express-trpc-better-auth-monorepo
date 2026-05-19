use axum::{routing::get, Router};

use crate::state::AppState;

use super::handler;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/posts", get(handler::list_posts).post(handler::create_post))
        .route(
            "/posts/{id}",
            get(handler::get_post)
                .patch(handler::update_post)
                .delete(handler::delete_post),
        )
}
