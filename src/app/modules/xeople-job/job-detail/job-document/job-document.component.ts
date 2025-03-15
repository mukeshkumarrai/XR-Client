import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import{ CreateNewDocumentComponent} from 'src/app/modules/EWM-Candidate/candidate-document/create-new-document/create-new-document.component';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import{DocumentService}from 'src/app/shared/services/candidate/document.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CreateFolderComponent } from '@app/modules/EWM-Candidate/candidate-document/create-folder/create-folder.component';
import { CreateDocumentComponent } from '@app/modules/EWM-Candidate/candidate-document/create-document/create-document.component';

/**
 * Each node has a name and an optional list of children.
 */
 interface FoodNode {
  HashParameter: string;
  Id:number
  Children?: FoodNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  Id:number;
}


@Component({
  selector: 'app-job-document',
  templateUrl: './job-document.component.html',
  styleUrls: ['./job-document.component.scss']
})
export class JobDocumentComponent implements OnInit {

  loadingscroll:boolean=false;
  public userpreferences: Userpreferences;
  gridView:any=[];
  sortedcolumnName:string='Name';
  sortDirection:string='asc';
  searchVal:string='';
  loadingPopup:boolean=false;
  isvisible:boolean=false;
  loading:boolean=false;
  loadingSearch:boolean=false;
  @Input() candidateId:any;
  @Input() documentFor:any;
  pageNo: number=1;
  pageSize: number;
  totalRecords: number=0;
  sortingValue: string='Name,asc';
  ascIcon: string;
  descIcon: string;
  canLoad: any;
  pendingLoad: boolean;
  auditParameter: string;
  TREE_DATA: FoodNode[];
  activeNode:any='';  
  documentTreeMaxNode=3;
  activatedRoute:any;

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.Children && node.Children?.length > 0,
      name: node.HashParameter,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.Children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  //sidenav
  mobileQuery: MediaQueryList;
  mobileQueryClick: MediaQueryList;
  desktopQueryOver: MediaQueryList;

  private _mobileQueryListener: () => void;
  dataToBind: any;
  documentTypeOptions:any;
  iconFileType
  // sidenav
  hasSearchParam:any;
  
  @Output() totalDocs = new EventEmitter();
  headerlabel: any=[{Id:0,Name:'.'}];
  background70: any;
  expandedNodes: any[];
  
  searchSubject$ = new Subject<any>();
  public animationVar: any;
  dirctionalLang;
  documentId: number=0;
  constructor( public _userpreferencesService: UserpreferencesService,public dialog: MatDialog, public candidateService:CandidateService,
    private _services:DocumentService,private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private routes: ActivatedRoute,private route: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private http: HttpClient
    ,private appSettingsService: AppSettingsService) {
       /*
        @Type: File, <ts>
        @Name: Json file 
        @Who: Nitin Bhati
        @When: 08-oct-2021
        @Why: EWM-3225
        @What: Read json file
        */
       this.http.get("assets/config/document-config.json").subscribe(data => {
        this.documentTypeOptions = JSON.parse(JSON.stringify(data));
       })
      this.pageSize = this.appSettingsService.pagesize;
      this.documentTreeMaxNode=this._appSetting.maxleveloftreenode;
      this.auditParameter = encodeURIComponent('candidate Document');
      //this.dataSource.data = TREE_DATA;
      this.mobileQuery = media.matchMedia('(max-width: 900px)');;
      this.mobileQueryClick = media.matchMedia('(max-width: 1024px)');
      this.desktopQueryOver = media.matchMedia('(min-width: 1024px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
     }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
 
  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.ascIcon='north';
    
    this.getAlldocument(false,false);
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
      this.background70 = this.hexToRGB(primaryColor, 0.70);

      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loadingSearch = true;
        this.getAlldocument(false,true);
         });
    this.animationVar = ButtonTypes;
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.

//When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.
   // if (this.routes.snapshot.queryParams.search != null) {
    //  this.hasSearchParam=this.routes.snapshot.queryParams.search;
      // this.searchVal= this.hasSearchParam; 
     
      // this.onFilter(this.searchVal)
  //  }
    // this.routes.queryParams.subscribe((value) => {
    //   this.hasSearchParam=value.search;
    //   if(value.search){
    //  this.searchVal=value.search; 
     
    //   this.onFilter(this.searchVal)}
    // })
    // var originalURL = window.location.href;
    // this.removeParam("search", originalURL);
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  onSort(columnName)
  {
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    if(this.documentId==0){
      this.getAlldocument(false,false);
    }else{
      this.getDocumentHierarchy(this.documentId);
    }
   
  }
  onScrollDown()
  {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      this.pageNo = this.pageNo + 1;
      this.getAlldocument(true,false);

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }

  }
  onFilter(searchVal)
 
  {     
    if (searchVal?.length > 0 && searchVal?.length < 3) {
      return;
    }
    this.pageNo=1;
    this.searchSubject$.next(searchVal);
   
  }
  openPopUp()
  {    
    if(this.activeNode!='' && this.activeNode.level==this.documentTreeMaxNode)
    {
      this.snackBService.showErrorSnackBar(this.translateService.instant("node can be only add till "+this.documentTreeMaxNode+" level"), "200");
      return; 
    }
    let name='';
    if(this.activeNode!='')
    {
      name=this.activeNode.name.split('#')[0];

    }
    const dialogRef = this.dialog.open(CreateNewDocumentComponent, {
      maxWidth: '550px',
      width:"90%",
      panelClass: ['add-folder-document', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data:{name:this.headerlabel}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult=='')
      {
        return;
      }
      else if (dialogResult == 'folder') {
        this.OpenFolderPopUp(undefined);
      }
      else{
      this.OpenDocuemntPopUp(undefined);
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

  }
  getAlldocument(isScroll,isSearch) {  
    this.loadingscroll=isScroll; 
    this.loadingSearch=isSearch;
    if(!isScroll&&!isSearch){
      this.loading=true;
    }
   
   this._services.getAllDocuemnt(this.pageNo,this.pageSize,this.sortingValue,this.searchVal,this.candidateId)
   .subscribe((data:ResponceData)=>{
     if(data.HttpStatusCode==200)
     {
      // @suika @whn 13-07-2023 @EWM-12625
       let folderListData = this.getFilteredData(data.Data);
      if(isScroll)
      { 
        let nextgridView = [];
        nextgridView = data.Data;
        this.gridView = this.gridView.concat(nextgridView);
        this.loadingscroll = false;
        this.loadingSearch = false;
      }else{
       this.gridView=data.Data;
    
       this.dataSource.data=[{HashParameter:'.\/#0#1',Id:0,Children:folderListData}];
       this.restoreExpandedNodes();
        /*
        @Type: File, <ts>
        @Name: Json file 
        @Who: Nitin Bhati
        @When: 08-oct-2021
        @Why: EWM-3225
        @What: for read icon from json file 
        */
       let dataToBindJson=data.Data;
       dataToBindJson.forEach(element => {
        const list = element.UploadDocument.split('.');
        const fileType = list[list?.length - 1];
       let FileTypeJson = this.documentTypeOptions?.filter(x=>x['type']===fileType.toLocaleLowerCase());
        if(FileTypeJson?.length>0){
         element['logo'] = FileTypeJson[0].logo; 
        }   
       });  
       this.dataToBind=dataToBindJson;
      
       this.totalRecords=data.TotalRecord;
       this.loading=false;
       this.loadingSearch = false;
       this.loadingscroll = false;
       this.showdata(this.activeNode,this.gridView);
      }
      this.totalDocs.emit(true);
     }
     else if(data.HttpStatusCode==204)
     {
      this.gridView=null;
      this.totalRecords=data.TotalRecord;
      this.loading=false;
      this.loadingSearch = false;
      this.loadingscroll = false;
     }else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
      this.loadingscroll = false;
      this.loading = false;
      this.loadingSearch = false;
    }
  //   if(this.docId){
  //  // this.filterDocById();
  //   }
    
  }, err => {
    this.loading = false;
    this.loadingSearch = false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
   });
  }
  OpenFolderPopUp(Id)
  {
    let name='';
    let type=true;
    if(this.activeNode!=''&& Id==undefined)
    {
      Id=parseInt(this.activeNode.name.split('#')[1]);
      name=this.activeNode.name.split('#')[0];
      type=this.activeNode.name.split('#')[2]==0?false:true;
    }
    if(type){
      const dialogRef = this.dialog.open(CreateFolderComponent, {
        data: {header:'label_addfolder',
              label:'label_folderName',
              btnlabel:'label_save',
              folderId:0,
              candidateId:this.candidateId,
              parentId:Id==undefined?0:Id,
              name:this.headerlabel},
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
       if(dialogResult!=false)
       {
        dialogResult.UserTypeId=this.candidateId;
        dialogResult.PageName="candidate";
        dialogResult.BtnId="attachments-tab";
        if(Id!=undefined)
        {
          dialogResult.ParentId=Id;
        }
        this._services.createFolder(dialogResult).subscribe(
          (Res:ResponceData)=>{
            if(Res.HttpStatusCode==200)
            {
              this.getAlldocument(false,false);
            }
        })
       }
      });
    }
   else{
    this.snackBService.showErrorSnackBar(this.translateService.instant('label_msgAtDocumentSelection'), '');
    
   }
   if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

  // RTL Code
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList?.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }
  
   OpenDocuemntPopUp(Id)
   {
     let name='';
     let type=true;
     if(this.activeNode!=''&& Id==undefined)
     {
       Id=parseInt(this.activeNode.name.split('#')[1]); 
       name=this.activeNode.name.split('#')[0];
       type=this.activeNode.name.split('#')[2]==0?false:true;
     }
     if(type){
      const dialogRef = this.dialog.open(CreateDocumentComponent, {
        data:{candidateId:this.candidateId,openDocumentPopUpFor:this.documentFor,FolderId:Id,Name:this.headerlabel,docRequiredStatus:true},
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult)
        {
          this.getAlldocument(false,false);
        }
  
      });
     }
     else{
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_msgAtDocumentSelection'), '');
     
     }
     if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList?.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

   }


   

/*
@who: priti
*/
showdata(data,listdata)
{
  if(data!=''&&data!=undefined){
   let selecteddata=listdata.find((d:any)=>d.Id==data.name.split('#')[1]);
   if(selecteddata!=null)
   {
    this.activeNode=data;
     if(selecteddata.Children?.length>0){
      this.dataToBind=selecteddata?.Children;
      this.headerlabel=[{Id:0,Name:'.'}];
      this.headerlabel=this.headerlabel.concat(selecteddata.Hierarchy);
     }
    else{
      this.dataToBind=[];
      this.dataToBind.push(selecteddata);
    }
   }
   else{
     if(listdata?.length>0){
    let childlistdata=[];
     listdata?.forEach(element => {
      if(element.Children?.length>0){
        if(childlistdata?.length==0){
          childlistdata=(element.Children);}
          else{
            childlistdata=childlistdata.concat(element.Children);
          }
      }
     });
     this.showdata(data,childlistdata);
    }
   }
  }
 
}


/*
@Type: File, <ts>
@Name: Json file 
@Who: Suika
@When: 13-July-2023
@Why: EWM-13104
@What: for read data from json  
*/
getListData(data,listdata,name){ 
  this.activeNode = data;
  this.documentId = name.split('#')[1];
  if(name.split('#')[1]==0){
   this.getAlldocument(false,false);
   //this.showdata(this.activeNode,this.gridView);
  }else{
    this.getDocumentHierarchy(name.split('#')[1]);
  }

}





/*
@Type: File, <ts>
@Name: getFilteredData
@Who: Suika
@When: 13-July-2023
@Why: EWM-13104
@What: for filter data from json  
*/
getFilteredData(Data){
  const folderListData =  Data.filter(p => p['DocumentType']=='Folder')
  .map(p => ({
      ...p,
      Children: p.Children.filter(s => s['DocumentType']=='Folder')
      .map(z => ({
        ...z,
        Children: this.getFilteredData(z.Children)
    }))
  }));

  return folderListData;
}

 
hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}
/*
@who: priti
@when:14-oct-2021
*/
onFilterClear()
{
  this.searchVal='';
  this.isvisible=true;
  
  
  
  this.onFilter(this.searchVal);
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.

//   if(this.hasSearchParam){
//   this.activatedRoute = window.location.href;

//   this.route.navigate([],{
//     relativeTo: this.activatedRoute,
//     queryParams: { search: null },
//     queryParamsHandling: 'merge'
//   });
//   this.hasSearchParam = undefined;
// }
}

/*
@who: Renu
@Why: EWM-3765 EWM-3063
@when:25-Nov-2021
*/
saveExpandedNodes(node) {
  this.activeNode=node;
  this.expandedNodes = new Array<any>();
  this.treeControl.dataNodes.forEach(node => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
          this.expandedNodes.push(node);
      }
  });
 
}
/*
@who: Renu
@Why: EWM-3765 EWM-3063
@when:25-Nov-2021
*/
restoreExpandedNodes() {
  if(this.expandedNodes){
    this.expandedNodes.forEach(node => {
      this.treeControl.expand(this.treeControl.dataNodes.find(n => n.name.split('#')[1] === node.name.split('#')[1]));
  });
  }

}
 /*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: maneesh
    @When: 13-feb-2023
    @Why: EWM-10466
    @What: add and remove animation
     */

    mouseoverAnimation(matIconId, animationName) {
      let amin = localStorage.getItem('animation');
      if (Number(amin) != 0) {
        document.getElementById(matIconId).classList.add(animationName);
      }
    }
    mouseleaveAnimation(matIconId, animationName) {
      document.getElementById(matIconId).classList.remove(animationName)
    }

    // refresh button onclick method by maneesh
  refreshComponent(){
    this.activatedRoute = window.location.href;

    this.route.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });

this.searchVal='';
    this.getAlldocument(false,false);
  }
// filterDocById(){
//   this.dataToBind=this.dataToBind.filter((x)=>x.Id==this.docId)
  
// }




/*
@Type: File, <ts>
@Name: Json file 
@Who: Suika
@When: 13-July-2023
@Why: EWM-13104
@What: for read data from json  
*/
getDocumentHierarchy(val) { 
  this.documentId = val;
  this.loading=true;
 this._services.getDocumentHierarchy(this.pageNo,this.pageSize,this.sortingValue,this.searchVal,this.documentId)
 .subscribe((data:ResponceData)=>{
   if(data.HttpStatusCode==200)
   {
     this.dataToBind = data.Data?.Children;
     this.loading=false;
    this.totalDocs.emit(true);
   }
   else if(data.HttpStatusCode==204)
   {
    this.dataToBind=[];
    this.totalRecords=data.TotalRecord;
    this.loading=false;
   }else {
    this.dataToBind=[];
    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
    this.loading = false;
  }
  
}, err => {
  this.loading = false;
  this.loadingSearch = false;
  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
 });
}
 
}
