use sea_orm::entity::prelude::*;
use sea_orm_migration::sea_orm::{self, JsonValue};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "records")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub date: String,
    pub mediction_record: Option<JsonValue>,
    pub sugar_levels: Option<JsonValue>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
