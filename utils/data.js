module.exports = {
  house_type(){//房型
    return [this.get_arr(20,'室',2), this.get_arr(20,'厅'), this.get_arr(10,'卫')]
  },
  floor(){//楼层
    return [this.get_arr(100,'层',2), this.get_arr(100,'共',1)]
  },
  get_arr(num,str,flag){
    let arr = [];
    for(let i=0;i<=num;i++){
      if(flag==1){
        if(i>0){
          arr.push({ num: i, name: str + i + '层' });
        }
      }else if(flag == 2){
        if(i > 0){
          arr.push({ num: i, name: i + str });
        }
      }else{
        arr.push({ num: i, name: i + str });
      }
    }
    return arr;
  },
  msg(){
    return {
      type:'',
      title:'',
      areas:'',
      price:'',
      totalprice:'',
      village:'',
      address:'',
      floor:'',
      direction_type_id:'',
      years:'',
      owner:'',
      phone:'',
      introduce:'',
      lat:'',
      lng:'',
      room:'',
      house_status:'',
      area_id:''
    }
  }
}