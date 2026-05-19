use super::dto::UserResponseDto;
use super::model::UserRecord;

pub fn to_response(record: UserRecord) -> UserResponseDto {
    UserResponseDto {
        id: record.id.to_string(),
        display_name: record.display_name,
    }
}
