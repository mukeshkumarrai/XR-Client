import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public auditParameter;
  public loading: boolean;
  
stage = [{
  stageName:'Stage1', 
  stageId:1,
  candidates:[{ 
    candidateName: 'Poonam',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '1',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Anjali',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '1',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Priyanshi',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '1',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
},{
  stageName:'Stage2', 
  stageId:2,
  candidates:[{ 
    candidateName: 'Suman',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '2',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Shubham',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '2',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Mohit',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '2',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
},{
  stageName:'Stage3', 
  stageId:3,
  candidates:[{ 
    candidateName: 'Ramesh',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '3',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Rahul',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '3',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Govind',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '3',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
},{
  stageName:'Stage4', 
  stageId:4,
  candidates:[{ 
    candidateName: 'Aman',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '4',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Neelam',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '4',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Gaurav',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '4',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
},{
  stageName:'Stage5', 
  stageId:5,
  candidates:[{ 
    candidateName: 'Renu Adhikari',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '5',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Suika',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '5',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Nitin',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '5',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
},{
  stageName:'Stage6', 
  stageId:6,
  candidates:[{ 
    candidateName: 'Rajesh Verma',
    candidateId: '11',
    Satge: 'Admiral Flankson',
    stageId: '6',
    SubStageId:1,
    SubStageName : 'Stage1'
  },
  { 
  candidateName: 'Ankit Rajput',
  candidateId: '10',
  Satge: 'Admiral Flankson',
  stageId: '6',
  SubStageId:1,
  SubStageName : 'Stage1'
  
  },
  { 
  candidateName: 'Piyush',
  candidateId: '8',
  Satge: 'Admiral Flankson',
  stageId: '6',
  SubStageId:2,
  SubStageName : 'Stage2'
  
  }]
}
];


candidates = [
  { 
  candidateName: 'Rajesh Verma',
  candidateId: '11',
  Satge: 'Admiral Flankson',
  stageId: '1',
  SubStageId:1,
  SubStageName : 'Stage1'
},
{ 
candidateName: 'Ankit Rajput',
candidateId: '10',
Satge: 'Admiral Flankson',
stageId: '1',
SubStageId:1,
SubStageName : 'Stage1'

},
{ 
candidateName: 'Piyush',
candidateId: '8',
Satge: 'Admiral Flankson',
stageId: '2',
SubStageId:2,
SubStageName : 'Stage2'

},
{ 
candidateName: 'Sataya Parkash',
candidateId: '7',
Satge: 'Admiral Flankson',
stageId: '2',
SubStageId:2,
SubStageName : 'Stage2'

},
{
candidateName: 'Anup Singh',
candidateId: '6',
Satge: 'Admiral Flankson',
stageId: '3',
SubStageId:3,
SubStageName : 'Stage3'

},
{ 
candidateName: 'Priti',
candidateId: '5',
Satge: 'Admiral Flankson',
stageId: '4',
SubStageId:4,
SubStageName : 'Stage4'

},
{ 
candidateName: 'Naresh',
candidateId: '4',
Satge: 'Admiral Flankson',
stageId: '5',
SubStageId:4,
SubStageName : 'Stage4'

},
{ 
candidateName: 'Suika Birhman',
candidateId: '3',
Satge: 'Admiral Flankson',
stageId: '5',
SubStageId:5,
SubStageName : 'Stage5'

},
{ 
candidateName: 'Nitin Bhati',
candidateId: '2',
Satge: 'Admiral Flankson',
stageId: '6',
SubStageId:5,
SubStageName : 'Stage5'
},
{ 
candidateName: 'Renu Adhikari',
candidateId: '1',
Satge: 'Hiring',
stageId: '6',
SubStageId:6,
SubStageName : 'Stage6'
},

];
public finalArray:any=[];
connectedTo = [];
  constructor(public _sidebarService: SidebarService, private route: Router, private commonServiesService: CommonServiesService) { }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    
 /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
 this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
 //

 /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
 this.commonServiesService.searchEnableCheck(1);

    for (let s of this.stage) {
      this.connectedTo.push(s.stageName);
    };
    //console.log(this.connectedTo);
  }

  onScrollDown(ev?) { }



  fleet = [
    {
      item:'Fleet #5',
      children:[
        { item: 'Admiral Flankson' },
        { item: 'pvt. centeras' },
        { item: 'pvt. leeft' },
        { item: 'pvt. rijks' }
      ]
    },
    {
      item:'Fleet #2',
      children: [
        { item: 'Admiral Parkour' },
        { item: 'pvt. jumph' },
        { item: 'pvt. landts' },
        { item: 'pvt. drobs' }
      ]
    },
    {
      item: 'Fleet #3',
      children: [
        { item: 'Admiral Tombs' },
        { item: 'pvt. zomboss' },
        { item: 'pvt. digger' },
        { item: 'pvt. skaari' }
      ]
    }
  ]

  drop(event: CdkDragDrop<{}[]>){
  
    if(event.previousContainer == event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }    
    
  }

  name = 'Angular';



 

}
