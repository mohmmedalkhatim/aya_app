use crate::entities::records;
use sea_orm_migration::{
    prelude::*,
    sea_orm::Schema,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        let backend = manager.get_database_backend();
        let schema = Schema::new(backend);
        manager
            .create_table(schema.create_table_from_entity(records::Entity))
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .drop_table(Table::drop().table(records::Entity).to_owned())
            .await
    }
}
