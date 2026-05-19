use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;

use super::dto::{CreatePostDto, ListPostsQueryDto, UpdatePostDto};
use super::model::PostRecord;

pub struct PostRepository;

impl PostRepository {
    pub async fn list(pool: &PgPool, query: &ListPostsQueryDto) -> Result<Vec<PostRecord>, AppError> {
        let rows = sqlx::query_as::<_, PostRecord>(
            r#"
            SELECT id, title, content, author_id, created_at, updated_at
            FROM posts
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(query.limit)
        .bind(query.offset)
        .fetch_all(pool)
        .await?;

        Ok(rows)
    }

    pub async fn count(pool: &PgPool) -> Result<i64, AppError> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*)::bigint FROM posts")
            .fetch_one(pool)
            .await?;
        Ok(row.0)
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Option<PostRecord>, AppError> {
        let row = sqlx::query_as::<_, PostRecord>(
            r#"
            SELECT id, title, content, author_id, created_at, updated_at
            FROM posts WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;

        Ok(row)
    }

    pub async fn create(
        pool: &PgPool,
        author_id: Uuid,
        dto: &CreatePostDto,
    ) -> Result<PostRecord, AppError> {
        let id = Uuid::new_v4();
        let row = sqlx::query_as::<_, PostRecord>(
            r#"
            INSERT INTO posts (id, title, content, author_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, content, author_id, created_at, updated_at
            "#,
        )
        .bind(id)
        .bind(&dto.title)
        .bind(&dto.content)
        .bind(author_id)
        .fetch_one(pool)
        .await?;

        Ok(row)
    }

    pub async fn update(
        pool: &PgPool,
        id: Uuid,
        dto: &UpdatePostDto,
    ) -> Result<Option<PostRecord>, AppError> {
        let existing = Self::find_by_id(pool, id).await?;
        let Some(mut post) = existing else {
            return Ok(None);
        };

        if let Some(title) = &dto.title {
            post.title = title.clone();
        }
        if let Some(content) = &dto.content {
            post.content = content.clone();
        }

        let row = sqlx::query_as::<_, PostRecord>(
            r#"
            UPDATE posts
            SET title = $2, content = $3, updated_at = NOW()
            WHERE id = $1
            RETURNING id, title, content, author_id, created_at, updated_at
            "#,
        )
        .bind(id)
        .bind(&post.title)
        .bind(&post.content)
        .fetch_optional(pool)
        .await?;

        Ok(row)
    }

    pub async fn delete(pool: &PgPool, id: Uuid) -> Result<bool, AppError> {
        let result = sqlx::query("DELETE FROM posts WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }
}
