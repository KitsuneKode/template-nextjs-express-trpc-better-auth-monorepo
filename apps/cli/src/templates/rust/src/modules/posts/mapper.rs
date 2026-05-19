use serde::Serialize;

use super::model::PostRecord;

#[derive(Debug, Serialize)]
pub struct PostResponseDto {
    pub id: String,
    pub title: String,
    pub content: String,
    pub author_id: String,
    pub created_at: String,
    pub updated_at: String,
}

pub fn to_response(record: PostRecord) -> PostResponseDto {
    PostResponseDto {
        id: record.id.to_string(),
        title: record.title,
        content: record.content,
        author_id: record.author_id.to_string(),
        created_at: record.created_at.to_rfc3339(),
        updated_at: record.updated_at.to_rfc3339(),
    }
}
