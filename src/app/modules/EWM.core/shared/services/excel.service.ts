import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  async generateExcel(data: any[], param: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Applicant Details');
    //worksheet.addRow([]);
    if (param.toLowerCase() == 'bulkextract') { 
      let keys = ['ExternalId', 'Title', 'FirstName', 'LastName', 'UniqueId', 'ExternalId', 'Email', 'Gender', 'DateOfHire',
        'Status', 'Reason', 'Office', 'Priority', 'Resume', 'MemberAppKeyAndroid','MemberAppKeyIOS', 'GlobalId', 'CountryCode', 'PhoneNo', 'AddressLine1', 'AddressLine2', 'Country','State',
        'District', 'District', 'Postalcode', 'Industry', 'Expertise', 'Experience', 'EmergencyName', 'EmergencyRelation',
        'EmergencyMobileNo', 'LastShiftWorked','EmployeeStatusNotes','ScreeningNotes','NoOfShifts','IsCandidateCreated', 'StatusMessage','IssueDescription'];
      let result = data.map(o => keys.map(k => o[k]));
      const header =['Candidate Id', 'Title', 'First Name', 'Last Name', 'Unique Id', 'External Id', 'Email', 'Gender', 'Date of Hire',
      'Member Status', 'Reason', 'Office', 'Priority', 'Resume', 'Member App Key Android','Member App Key IOS', 'Global Id', 'Country Code', 'Phone No', 'Address Line1', 'Address Line2', 'Country','State',
      'City/Town', 'District/Suburb', 'Postal Code', 'Industry', 'Skills', 'Experience', 'Emergency Contact Name', 'Emergency Contact Relation',
      'Emergency Contact Mobile No','Last Shift Worked', 'Employment Status Notes','Screening Notes','No of Shifts','Status', 'Status Message','Issue Description'];
      const headerRow = worksheet.addRow(header);
      result.forEach((d, i) => {
        const row = worksheet.addRow(d);
       const status = row.getCell(37);
       row.getCell(5).alignment={horizontal:'left'};
       row.getCell(36).alignment={horizontal:'left'};
       let bgcolor: string;
       let fgColor: string;
      if (status.value == true) {
        status.value='SUCCESS';
        bgcolor = 'ffffff';
        fgColor='ffffff';
      }else{
        status.value='FAILED';
        bgcolor = 'ff0000';
        fgColor='C00000';
      }
      [37,38].map(x=>worksheet.getCell(worksheet.rowCount,x).fill= { type: 'pattern',
      pattern: 'solid',
      fgColor:{argb:fgColor},
      bgColor:{argb:bgcolor}})
     // worksheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }
      );
      
      worksheet.columns.forEach(column => {
        column.width = 30;
      })
     // worksheet.addRow([]);
      // Generate Excel File with given name
      let successCandidate=data.filter(x=>x.IsCandidateCreated && x.IsCandidateCreated==true);
      let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'))
      workbook.xlsx.writeBuffer().then((result: any) => {
      const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'EntireExtract_'+successCandidate?.length+'_'+currentUserDetails?.FirstName+'_'+formatDate(new Date(),'ddMMYYYYHHmm','en_US')+'.xlsx');
    });

    } else {
      let keys = ['MemberId', 'Name', 'Email','Message'];
      let result = data.map(o => keys.map(k => o[k]));
      const header = ['Member Id', 'Name', 'Email Id','Issue Description'];
      const headerRow = worksheet.addRow(header);
      result.forEach((d, i) => {
        const row = worksheet.addRow(d);
      }
      );
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 30;
      worksheet.addRow([]);
      // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((result: any) => {
      const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Push_job_report.xlsx');
    });

    }
    
  }
}
