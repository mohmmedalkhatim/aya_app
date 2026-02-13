use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug,Serialize,Deserialize,Clone,)]
struct Event{
    id:i32,
    title:String,
    create:Option<NaiveDate>
    
}
#[derive(Debug,Serialize,Deserialize,Clone,)]
struct Payload{
    command:String,
    data:Event,
    id:i32
}