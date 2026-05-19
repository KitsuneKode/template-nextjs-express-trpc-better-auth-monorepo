use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::error::AppError;
use crate::state::AppState;

use super::dto::{CreatePostDto, ListPostsQueryDto, UpdatePostDto};
use super::mapper::PostResponseDto;
use super::service::{CreatePostInput, DeletePostInput, PostService, UpdatePostInput};

fn actor_from_headers(headers: &axum::http::HeaderMap) -> Result<Uuid, AppError> {
    let auth = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    if auth == "Bearer demo" {
        return Ok(Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());
    }
    Err(AppError::Unauthorized(
        "Missing or invalid Authorization header (use Bearer demo)".into(),
    ))
}

pub async fn list_posts(
    State(state): State<AppState>,
    Query(query): Query<ListPostsQueryDto>,
) -> Result<Json<super::dto::PostListResponseDto>, AppError> {
    let result = PostService::list(&state, query).await?;
    Ok(Json(result))
}

pub async fn get_post(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<PostResponseDto>, AppError> {
    let post = PostService::get_by_id(&state, id).await?;
    Ok(Json(post))
}

pub async fn create_post(
    State(state): State<AppState>,
    headers: axum::http::HeaderMap,
    Json(body): Json<CreatePostDto>,
) -> Result<(StatusCode, Json<PostResponseDto>), AppError> {
    let actor_id = actor_from_headers(&headers)?;
    let post = PostService::create(
        &state,
        CreatePostInput {
            actor_id,
            data: body,
        },
    )
    .await?;
    Ok((StatusCode::CREATED, Json(post)))
}

pub async fn update_post(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    headers: axum::http::HeaderMap,
    Json(body): Json<UpdatePostDto>,
) -> Result<Json<PostResponseDto>, AppError> {
    let actor_id = actor_from_headers(&headers)?;
    let post = PostService::update(
        &state,
        UpdatePostInput {
            actor_id,
            post_id: id,
            data: body,
        },
    )
    .await?;
    Ok(Json(post))
}

pub async fn delete_post(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    headers: axum::http::HeaderMap,
) -> Result<StatusCode, AppError> {
    let actor_id = actor_from_headers(&headers)?;
    PostService::delete(
        &state,
        DeletePostInput {
            actor_id,
            post_id: id,
        },
    )
    .await?;
    Ok(StatusCode::NO_CONTENT)
}
