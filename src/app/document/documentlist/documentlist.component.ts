import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { MediaMatcher } from '@angular/cdk/layout';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { ViewDocumentComponent } from 'src/app/modules/EWM-Candidate/candidate-document/view-document/view-document.component';
import { PdfViewerComponent } from 'src/app/modules/EWM-Candidate/candidate-document/pdf-viewer/pdf-viewer.component';
import { HttpClient } from '@angular/common/http';
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
enum fileExtention{
  "application/zip"="zip",
  "application/pdf"="pdf",
  "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"="xlsx",
  "text/plain"="txt",
  "application/vnd.ms-word"="doc",
  "application/vnd.ms-excel"="xls",
  "image/png"="png",
  "image/jpeg"="jpeg",
  "image/gif"="gif",
  "text/csv"="csv"
}
@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.scss']
})
export class DocumentlistComponent implements OnInit {
  candidateIdData:string;
  gridView:any=[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"New Folder#1#1","AccessModeId":3,"IsOwner":1,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"Candidate#3#1","AccessModeId":3,"IsOwner":1,"Children":[],"Id":3,"ParentId":1,"Name":"Candidate","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""},{"ExpiryDate":1631786864226,"Owner":"priti sr","IsCollapse":false,"HashParameter":"covid test report 4th dose#8#0","AccessModeId":3,"IsOwner":1,"Children":[],"Id":8,"ParentId":1,"Name":"covid test report 4th dose","CategoryId":21,"Category":"","DocumentId":24,"DocumentName":"","LastActivity":1631787008865.31,"DocumentType":"Document","UploadDocument":"TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/445069E9-63A8-44BC-A5A2-E9A5797F0E37.PDF","PreviewUrl":"https://res-dev-ewm.entiredev.in/EWM/TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/445069E9-63A8-44BC-A5A2-E9A5797F0E37.PDF","DocumentSize":null,"ReferenceId":"12345"}],"Id":1,"ParentId":0,"Name":"New Folder","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""},{"ExpiryDate":0,"Owner":"Ankit Rajput","IsCollapse":false,"HashParameter":"nitin#69#1","AccessModeId":3,"IsOwner":0,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"file#42#0","AccessModeId":2,"IsOwner":1,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"test n#96#1","AccessModeId":2,"IsOwner":1,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"covid test report#111#0","AccessModeId":2,"IsOwner":1,"Children":[],"Id":111,"ParentId":96,"Name":"covid test report","CategoryId":23,"Category":"Medical ","DocumentId":27,"DocumentName":"Covid","LastActivity":1632134423836.95,"DocumentType":"Document","UploadDocument":"TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/F12479A5-C764-416B-A4A7-80676684C000.PDF","PreviewUrl":"https://res-dev-ewm.entiredev.in/EWM/TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/F12479A5-C764-416B-A4A7-80676684C000.PDF","DocumentSize":null,"ReferenceId":"112133243"}],"Id":96,"ParentId":42,"Name":"test n","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""}],"Id":42,"ParentId":69,"Name":"file","CategoryId":22,"Category":"Education","DocumentId":26,"DocumentName":"Xth marksheet","LastActivity":1632024674592.8,"DocumentType":"Document","UploadDocument":"TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/4CE1630E-7426-4430-B28E-283AB529776B.PDF","PreviewUrl":"https://res-dev-ewm.entiredev.in/EWM/TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/4CE1630E-7426-4430-B28E-283AB529776B.PDF","DocumentSize":null,"ReferenceId":"656565"},{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"child one#90#1","AccessModeId":2,"IsOwner":1,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"test data#91#0","AccessModeId":2,"IsOwner":1,"Children":[],"Id":91,"ParentId":90,"Name":"test data","CategoryId":23,"Category":"Medical ","DocumentId":27,"DocumentName":"Covid","LastActivity":1632122022282.18,"DocumentType":"Document","UploadDocument":"TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/25C8D7B4-227F-453B-BC32-F2EFE2506F18.XLSX","PreviewUrl":"https://res-dev-ewm.entiredev.in/EWM/TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/25C8D7B4-227F-453B-BC32-F2EFE2506F18.XLSX","DocumentSize":null,"ReferenceId":"123456a"}],"Id":90,"ParentId":69,"Name":"child one","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""}],"Id":69,"ParentId":0,"Name":"nitin","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""},{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"Other Report #30#1","AccessModeId":3,"IsOwner":1,"Children":[],"Id":30,"ParentId":0,"Name":"Other Report ","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""},{"ExpiryDate":0,"Owner":"Ankit Rajput","IsCollapse":false,"HashParameter":"TestN#110#1","AccessModeId":2,"IsOwner":0,"Children":[],"Id":110,"ParentId":0,"Name":"TestN","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""},{"ExpiryDate":0,"Owner":"Ankit Rajput","IsCollapse":false,"HashParameter":"test one#68#1","AccessModeId":3,"IsOwner":0,"Children":[{"ExpiryDate":0,"Owner":"priti sr","IsCollapse":false,"HashParameter":"TEST DATA.pdf#73#0","AccessModeId":3,"IsOwner":1,"Children":[],"Id":73,"ParentId":68,"Name":"TEST DATA.pdf","CategoryId":22,"Category":"Education","DocumentId":25,"DocumentName":"10th marksheet","LastActivity":1632107647930.07,"DocumentType":"Document","UploadDocument":"TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/8284415B-0D6A-4495-88AD-15389E1CF4CC.PDF","PreviewUrl":"https://res-dev-ewm.entiredev.in/EWM/TENANT/FCDB97C5-6470-49AE-B249-E5BD753F66BC/DOCUMENT/8284415B-0D6A-4495-88AD-15389E1CF4CC.PDF","DocumentSize":null,"ReferenceId":"78909"}],"Id":68,"ParentId":0,"Name":"test one","CategoryId":0,"Category":"","DocumentId":0,"DocumentName":"","LastActivity":0,"DocumentType":"Folder","UploadDocument":"","PreviewUrl":"","DocumentSize":null,"ReferenceId":""}];
  searchVal:string='';
  loading:boolean=false;
  loadingSearch:boolean=false;
  activeNode: any=[];
  dataToBind: any;
  loadingscroll: boolean;
  candidateId: any; 
   TREE_DATA: FoodNode[];
   sortedcolumnName:string='Name';
   sortDirection:string='asc';
   loadingPopup:boolean=false;
   isvisible:boolean=false;
   pageNo: number=1;
   pageSize: number;
   sortingValue: string='Name,asc';
   ascIcon: string;
   descIcon: string;
   canLoad: any;
   pendingLoad: boolean;
   public userpreferences: Userpreferences;
   documentTypeOptions:any;
  iconFileType
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      name: node.HashParameter,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.Children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  listforBreadcrum: any;
  constructor(public _userpreferencesService: UserpreferencesService,public dialog: MatDialog, 
    private _services:DocumentService,private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, changeDetectorRef: ChangeDetectorRef,media: MediaMatcher,private http: HttpClient) { 
      this.pageSize = this._appSetting.pagesize;
      this.mobileQuery = media.matchMedia('(max-width: 900px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      
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
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.ascIcon='north';
    //this.dataSource.data=[{HashParameter:'Root#0#1',Id:0,Children:this.gridView}];
   // this.dataSource.data=this.gridView;
    //this.dataToBind=this.gridView;
    this.getAlldocument(false,false);
  }
  onSort(columnName)
  {
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getAlldocument(false,false);
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
    }

  }
  onFilter(searchVal)
  {
    if (searchVal.length > 0 && searchVal.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pageNo=1;
    this.getAlldocument(false,true);
  }
  downloadData(Id,Name){
    this.loading=true;
    const formData={
      Id: Id,
      ExternalLinkCode:localStorage.getItem('ExternalLinkCode')//'VTJGc2RHVmtYMStnVEI2b3ZUeld5OE1TN0dxV3kxa0dDZkQ0SHlGUmhLK3RlTUw4NUFoYWY4MDVYUjJsK2taWWpIeGRZYWpsTlBoZmJyQ2hKZ09ITUgzbzcwNHdTa0VNbFU5NmxrMlJNczdQNmtHRzdGRC9hbHBpUFpyU0pPb0F4RUIxZUhJV1FiVWNGYXBHWmo4cmVqUWFWYjlyNUVBK20rVXdtTVREU1BNTFoydVhoQVZMbXNKMUxwTnRUVEUwWGdSVG1zdVBOZ3gvRlJCZkt0cFlMd2l1OUtFeHZLOS9RVTdKODAzK2RMNmw0SU5Na2NKazZZc3lkdFBEaS9BYWpwMUhWcnVCMjVnOU5DNGJEMHNIUHlPNXhpQXR2WjRHMjRLUkF3eFFlRWZEbnpjL3VyU3hzT0JMY2N2aEI0U092YVM2Q1ZiWXBiSjlKSnVqd3dvSy9ERVVjWW95bC96Y3NmVW1JYlkxVXR5b0ZUUnUrZERBWC9KeGFRRHRJTjZDaHBCZkdsODVOSlFPMnMyOVhkcDUxcmtlK1RMc2ZyTHhnODdyQ05ubjNmRFZnV21JUm52Ym5xaVFTTlVsT0lORHNKZk13M1VJQktZNjB2MmhIVmRZTTlscXhxRWRDdENEL1VDbDVlL0E4bnlQdnVwSStjRFJjdm9VS1FIYWV3NUswazlZekFPelRwSE9ySmRoYTdYM3p1V0tQSTFhR3BwYnFpZ1JjS0pTR0hjeFE5ckFTSVJZVVlPdzR2RmNHd2FSK3kvM212VTdILytOYkxQbi9mRFhMdVJna3dkN3FxK2R6SzRXSEF0TDNrcTdlVHVZV1ZueTE1NjV2QlhHTnNUY1RWTDlsdHc4S0VVV2FOZlZiS3JneU1oaXprUUQvZGJ1MTRvcEZRWlRpdnY2cW5zYzNUSzJYNjJ3c3FVTjZwdHVvT3IzNk1rdHFDcHNkU0FVekwzQ010bWVaUE1vZVFYOGI1OE1XTTEzRGNFNHNwYzFaQzBhL2l6MTc1VC9kOSthVDA1NlZiVnJFdUxTZG0wbFROL3JLRVNrQ1FoRDZTSEh6dkNERDlxRVM5Y0NFaWo5bmg1RlZ0aU4yam94dnBRYzVxSjhCUnpqTThuMzBqbXNkaTRDUEkzNDhZbmlXc2tmK0tqNjE3ZUYzaEJ6RDRXTHBXRG5FU05NNm0vclJZOHRHcnkydDlud2lzdXBMWEs3c1BEWi9CN1J3NTVxTUdrTWVUakF5M2c0SURtYkI5ZTVFSEU2T1pvR2V6M01xSE9TT3Y4NTF1cGhsc1hHUnlzc3FHQXNJbVJYMm8wbnMzcElCQysxM0EyTzNrbz0'
    }
    this._services.downloadDataExternally(formData).subscribe(
      (data:any)=>{
     const Url= URL.createObjectURL(data)
      const fileExt=fileExtention[data.type];
      let fileName=Name+'.'+fileExt;
      this.loading=false;
      this.downloadFile(data,fileName);
      },
      err => {
        this.loading=false;
      })
  }
  private downloadFile(data,filename) {
    const downloadedFile = new Blob([data], { type: data.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
}
  OpenViewPopUp(Id){
    const dialogRef = this.dialog.open(ViewDocumentComponent, {
      maxWidth: "550px",
      width: "90%",
      maxHeight: "85%",
      data:{Id:Id,isExternal:true},
      panelClass: ['quick-modalbox', 'view_Document', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      {
       
      }
     
    });
  }
  loadViewer(url,type){

    if(type=='Folder')
    {
      return;
    }
    const list = url.split('.');
    const fileType = list[list.length - 1];
    if(fileType=='PDF' || fileType=='pdf'){
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      maxWidth: "1000px",
      width: "90%",
      maxHeight: "85%",
      data:{url:url,fileType:fileType},
      panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      return;
     
    });
  }else{
    window.open(url,'_blank');
  }
  }
showdata(data,listdata)
{
  if(data!=''&&data!=undefined){
    // if(this.activeNode!='' && this.activeNode.name==data.name)
    // {
    //   this.activeNode='';
    //   this.getAlldocument(false,false);
    //   return;
    // }
   let selecteddata=listdata.find((d:any)=>d.Id==data);
   if(selecteddata!=null)
   {
    this.activeNode=data;
     if(selecteddata.Children.length>0){
      this.dataToBind=selecteddata.Children;
      this.listforBreadcrum =selecteddata.Hierarchy;
     }
    else{
      this.dataToBind=[];
      this.dataToBind.push(selecteddata);
    }
   }
   else{
     if(listdata.length>0){
    let childlistdata=[];
     listdata.forEach(element => {
      if(element.Children.length>0){
        if(childlistdata.length==0){
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
getAlldocument(isScroll,isSearch) {  
  this.loadingscroll=isScroll; 
  this.loadingSearch=isSearch;
  if(!isScroll&&!isSearch){
    this.loading=true;
  }
 const formData={
  ExternalLinkCode:localStorage.getItem('ExternalLinkCode'),
  //ExternalLinkCode:'VTJGc2RHVmtYMStnVEI2b3ZUeld5OE1TN0dxV3kxa0dDZkQ0SHlGUmhLK3RlTUw4NUFoYWY4MDVYUjJsK2taWWpIeGRZYWpsTlBoZmJyQ2hKZ09ITUgzbzcwNHdTa0VNbFU5NmxrMlJNczdQNmtHRzdGRC9hbHBpUFpyU0pPb0F4RUIxZUhJV1FiVWNGYXBHWmo4cmVqUWFWYjlyNUVBK20rVXdtTVREU1BNTFoydVhoQVZMbXNKMUxwTnRUVEUwWGdSVG1zdVBOZ3gvRlJCZkt0cFlMd2l1OUtFeHZLOS9RVTdKODAzK2RMNmw0SU5Na2NKazZZc3lkdFBEaS9BYWpwMUhWcnVCMjVnOU5DNGJEMHNIUHlPNXhpQXR2WjRHMjRLUkF3eFFlRWZEbnpjL3VyU3hzT0JMY2N2aEI0U092YVM2Q1ZiWXBiSjlKSnVqd3dvSy9ERVVjWW95bC96Y3NmVW1JYlkxVXR5b0ZUUnUrZERBWC9KeGFRRHRJTjZDaHBCZkdsODVOSlFPMnMyOVhkcDUxcmtlK1RMc2ZyTHhnODdyQ05ubjNmRFZnV21JUm52Ym5xaVFTTlVsT0lORHNKZk13M1VJQktZNjB2MmhIVmRZTTlscXhxRWRDdENEL1VDbDVlL0E4bnlQdnVwSStjRFJjdm9VS1FIYWV3NUswazlZekFPelRwSE9ySmRoYTdYM3p1V0tQSTFhR3BwYnFpZ1JjS0pTR0hjeFE5ckFTSVJZVVlPdzR2RmNHd2FSK3kvM212VTdILytOYkxQbi9mRFhMdVJna3dkN3FxK2R6SzRXSEF0TDNrcTdlVHVZV1ZueTE1NjV2QlhHTnNUY1RWTDlsdHc4S0VVV2FOZlZiS3JneU1oaXprUUQvZGJ1MTRvcEZRWlRpdnY2cW5zYzNUSzJYNjJ3c3FVTjZwdHVvT3IzNk1rdHFDcHNkU0FVekwzQ010bWVaUE1vZVFYOGI1OE1XTTEzRGNFNHNwYzFaQzBhL2l6MTc1VC9kOSthVDA1NlZiVnJFdUxTZG0wbFROL3JLRVNrQ1FoRDZTSEh6dkNERDlxRVM5Y0NFaWo5bmg1RlZ0aU4yam94dnBRYzVxSjhCUnpqTThuMzBqbXNkaTRDUEkzNDhZbmlXc2tmK0tqNjE3ZUYzaEJ6RDRXTHBXRG5FU05NNm0vclJZOHRHcnkydDlud2lzdXBMWEs3c1BEWi9CN1J3NTVxTUdrTWVUakF5M2c0SURtYkI5ZTVFSEU2T1pvR2V6M01xSE9TT3Y4NTF1cGhsc1hHUnlzc3FHQXNJbVJYMm8wbnMzcElCQysxM0EyTzNrbz0',
  search:this.searchVal,
  PageNumber:this.pageNo,
  PageSize:this.pageSize
 }
 this._services.getAllDocumentExternally(formData)
 .subscribe((data:ResponceData)=>{
   if(data.HttpStatusCode==200)
   {
    if(isScroll)
    { 
      let nextgridView = [];
      nextgridView = data.Data;
      this.gridView = this.gridView.concat(nextgridView);
      this.loadingscroll = false;
      this.loadingSearch = false;
      this.loading=false;
    }else{
     this.gridView=data.Data;
     this.dataSource.data=[{HashParameter:'.\/#0#1',Id:0,Children:this.gridView}];//data.Data;
     this.dataToBind=data.Data;
     this.loading=false;
     this.loadingSearch = false;
     this.loadingscroll = false;
     this.showdata(this.activeNode,this.gridView);
    }
   }
   else if(data.HttpStatusCode==204)
   {
    this.gridView=null;
    this.loading=false;
    this.loadingSearch = false;
    this.loadingscroll = false;
   }else {
    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
    this.loadingscroll = false;
    this.loading = false;
    this.loadingSearch = false;
  }
}, err => {
  this.loading = false;
  this.loadingSearch = false;
  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
 });
}
redirect(id)
{
  
  this.showdata(id,this.gridView);
}

getIcon(uploadDocument) {
  if(uploadDocument){

  const list = uploadDocument.split('.');
  const fileType = list[list.length - 1];
  let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
     let logo = FileTypeJson[0].logo; ;
 
    return logo;

  }
}
}
