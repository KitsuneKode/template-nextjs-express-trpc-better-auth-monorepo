use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::mapper::PostResponseDto;

#[derive(Debug, Deserialize)]
pub struct CreatePostDto {
    pub title: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePostDto {
    pub title: Option<String>,
    pub content: Option<String>,
}

impl UpdatePostDto {
    pub fn is_empty(&self) -> bool {
        self.title.is_none() && self.content.is_none()
    }
}

#[derive(Debug, Deserialize)]
pub struct ListPostsQueryDto {
    #[serde(default = "default_limit")]
    pub limit: i64,
    #[serde(default)]
    pub offset: i64,
}

fn default_limit() -> i64 {
    20
}

#[derive(Debug, Serialize)]
pub struct PostListResponseDto {
    pub items: Vec<PostResponseDto>,
    pub total: i64,
}

#[derive(Debug)]
pub struct PostPathParams {
    pub id: Uuid,
}
