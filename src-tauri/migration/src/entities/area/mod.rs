use crate::entities::*;



#[derive(Serialize,Deserialize,PartialEq,DeriveEntityModel,Clone,Debug)]
#[sea_orm(table_name= "Area")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:u32,
    pub user_id:u32,
    pub title:Option<String>,
    pub descrption:Option<String>,
}


impl ActiveModelBehavior for ActiveModel {
    
}
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {

}