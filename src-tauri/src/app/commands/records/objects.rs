use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Record {
    pub id: Option<i32>,
    pub date: String,
    pub medictions_records: Option<Value>,
    pub sugar_levels: Option<Value>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub data: Option<Record>,
    pub date: Option<String>,
    pub id: Option<i32>,
}
