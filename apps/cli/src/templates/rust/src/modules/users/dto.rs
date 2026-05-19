use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct UserResponseDto {
    pub id: String,
    pub display_name: String,
}
