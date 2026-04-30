use migration::entities::records::{self, ActiveModel, Entity, Model};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};


pub async fn find_one_by_date(date: String, db: &DatabaseConnection) -> Result<Model, String> {
    let update = Entity::find()
        .filter(records::Column::Date.eq(date))
        .one(db)
        .await
        .map_err(|err| err.to_string())?;
    match update {
        Some(state) => Ok(state),
        None => Err("couldn't find the function".to_string()),
    }
}
