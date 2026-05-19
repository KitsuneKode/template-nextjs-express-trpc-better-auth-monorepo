use uuid::Uuid;

use super::model::PostRecord;

pub fn can_update_post(actor_id: Uuid, post: &PostRecord) -> bool {
    post.author_id == actor_id
}

pub fn can_delete_post(actor_id: Uuid, post: &PostRecord) -> bool {
    post.author_id == actor_id
}
