use chrono::NaiveDate;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use sea_orm_migration::seaql_migrations::Relation;
use serde_json::Value;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, DeriveEntityModel)]
#[sea_orm(table_name = "events")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32, // Google event ID

    pub kind: Option<String>,
    pub etag: Option<String>,
    pub status: Option<String>,
    pub html_link: Option<String>,

    pub created: Option<NaiveDate>,
    pub updated: Option<NaiveDate>,

    pub summary: Option<String>,
    pub description: Option<String>,
    pub location: Option<String>,
    pub color_id: Option<String>,

    // Start / End
    pub start_date: Option<NaiveDate>,
    pub start_datetime: Option<NaiveDate>,
    pub start_timezone: Option<String>,

    pub end_date: Option<NaiveDate>,
    pub end_datetime: Option<NaiveDate>,
    pub end_timezone: Option<String>,

    pub end_time_unspecified: Option<bool>,

    // Recurrence
    #[sea_orm(column_type = "JsonBinary")]
    pub recurrence: Option<Value>,

    pub recurring_event_id: Option<String>,

    pub transparency: Option<String>,
    pub visibility: Option<String>,
    pub ical_uid: Option<String>,
    pub sequence: Option<i32>,

    pub attendees_omitted: Option<bool>,

    // Feature Flags
    pub anyone_can_add_self: Option<bool>,
    pub guests_can_invite_others: Option<bool>,
    pub guests_can_modify: Option<bool>,
    pub guests_can_see_other_guests: Option<bool>,
    pub private_copy: Option<bool>,
    pub locked: Option<bool>,

    pub hangout_link: Option<String>,
    pub event_type: Option<String>,

    // JSON heavy structures
    #[sea_orm(column_type = "JsonBinary")]
    pub creator: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub organizer: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub original_start_time: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub attendees: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub extended_properties: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub conference_data: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub gadget: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub reminders: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub source: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub working_location_properties: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub out_of_office_properties: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub focus_time_properties: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub attachments: Option<Value>,

    #[sea_orm(column_type = "JsonBinary")]
    pub birthday_properties: Option<Value>,
}

#[derive(DeriveRelation, EnumIter, Debug, Clone)]
enum Relatiion {}
impl ActiveModelBehavior for ActiveModel {}
