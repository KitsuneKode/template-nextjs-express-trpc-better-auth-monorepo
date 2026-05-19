use uuid::Uuid;

use crate::error::AppError;
use crate::state::AppState;

use super::dto::{CreatePostDto, ListPostsQueryDto, PostListResponseDto, UpdatePostDto};
use super::mapper::{self, PostResponseDto};
use super::policy;
use super::repository::PostRepository;

pub struct CreatePostInput {
    pub actor_id: Uuid,
    pub data: CreatePostDto,
}

pub struct UpdatePostInput {
    pub actor_id: Uuid,
    pub post_id: Uuid,
    pub data: UpdatePostDto,
}

pub struct DeletePostInput {
    pub actor_id: Uuid,
    pub post_id: Uuid,
}

pub struct PostService;

impl PostService {
    fn pool(state: &AppState) -> Result<&sqlx::PgPool, AppError> {
        state
            .db
            .as_deref()
            .ok_or_else(|| AppError::Internal("database not configured".into()))
    }

    pub async fn list(
        state: &AppState,
        query: ListPostsQueryDto,
    ) -> Result<PostListResponseDto, AppError> {
        let pool = Self::pool(state)?;
        let items = PostRepository::list(pool, &query).await?;
        let total = PostRepository::count(pool).await?;
        Ok(PostListResponseDto {
            items: items.into_iter().map(mapper::to_response).collect(),
            total,
        })
    }

    pub async fn get_by_id(state: &AppState, id: Uuid) -> Result<PostResponseDto, AppError> {
        let pool = Self::pool(state)?;
        let record = PostRepository::find_by_id(pool, id)
            .await?
            .ok_or_else(|| AppError::NotFound("Post not found".into()))?;
        Ok(mapper::to_response(record))
    }

    pub async fn create(
        state: &AppState,
        input: CreatePostInput,
    ) -> Result<PostResponseDto, AppError> {
        if input.data.title.trim().is_empty() {
            return Err(AppError::BadRequest("title is required".into()));
        }
        let pool = Self::pool(state)?;
        let record = PostRepository::create(pool, input.actor_id, &input.data).await?;
        Ok(mapper::to_response(record))
    }

    pub async fn update(
        state: &AppState,
        input: UpdatePostInput,
    ) -> Result<PostResponseDto, AppError> {
        if input.data.is_empty() {
            return Err(AppError::BadRequest(
                "PATCH body must include at least one field".into(),
            ));
        }

        let pool = Self::pool(state)?;
        let existing = PostRepository::find_by_id(pool, input.post_id)
            .await?
            .ok_or_else(|| AppError::NotFound("Post not found".into()))?;

        if !policy::can_update_post(input.actor_id, &existing) {
            return Err(AppError::Forbidden("Cannot update this post".into()));
        }

        let updated = PostRepository::update(pool, input.post_id, &input.data)
            .await?
            .ok_or_else(|| AppError::NotFound("Post not found".into()))?;

        Ok(mapper::to_response(updated))
    }

    pub async fn delete(state: &AppState, input: DeletePostInput) -> Result<(), AppError> {
        let pool = Self::pool(state)?;
        let existing = PostRepository::find_by_id(pool, input.post_id)
            .await?
            .ok_or_else(|| AppError::NotFound("Post not found".into()))?;

        if !policy::can_delete_post(input.actor_id, &existing) {
            return Err(AppError::Forbidden("Cannot delete this post".into()));
        }

        let deleted = PostRepository::delete(pool, input.post_id).await?;
        if !deleted {
            return Err(AppError::NotFound("Post not found".into()));
        }
        Ok(())
    }
}
