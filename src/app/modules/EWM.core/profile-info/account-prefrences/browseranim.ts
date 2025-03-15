/*  @Who: Adarsh @When: 13-dec-2021 @Why: EWM-3944 (add remove animations)*/
let isAnim:boolean
let data = localStorage.getItem('animation')
if(data==='0'){
   isAnim=false
}else{
  isAnim=true
}
export const BrowserAnim={
    checkAnim:isAnim,

}

 


