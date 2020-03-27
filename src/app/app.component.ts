import {
  Component,
  ChangeDetectorRef
} from '@angular/core';
import * as $ from 'jquery';
import {
  HttpClient
} from "@angular/common/http";
import 'datatables.net';
import 'datatables.net-bs4';
declare var google:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'retail-analytics-app';

  url: any;
  src: any;
  tableData: any;

  dataTable: any;

  showImage: boolean = false;
  showTable: boolean = false;
  //c:any;
  img_plain: any;
  private cx: CanvasRenderingContext2D;
  base_image: any;
  searchText: any;
  filteredData: any;
  chartData: any = {};
  tempChartData:any = {};
  distinctBrands: any = [];
  selectedBrand:any;
  brandSelected:boolean = false;


  constructor(private http: HttpClient, private chRef: ChangeDetectorRef) {

  }



  readURL() {

      this.showImage = true;
      //this.src = $('#image_url').val();
      this.src = "https://storage.googleapis.com/snap2insight-livedemo/assessment/test_image.jpg";

      $('#image_plain')
          .attr('src', this.src)
          .width(0)
          .height(0);


      var c = < HTMLCanvasElement > document.getElementById("myCanvas");
      var ctx = c.getContext("2d");

      var img = new Image();

      img.src = this.src;
      var self = this;
      img.onload = function() {

          ctx.drawImage(img, 0, 0, 500, 500);
          //   }

          for (var t in self.tableData) {
              ctx.beginPath();
              ctx.rect(((self.tableData[t].x) / 6), ((self.tableData[t].y) / 8.2), (self.tableData[t].width / 6.2), (self.tableData[t].height / 6.4));
              ctx.fillStyle = 'transparent';
              ctx.fill();
              ctx.lineWidth = 7;
              ctx.strokeStyle = 'blue';
              ctx.stroke();

          }

      }



  }


  fetchJSONfromURL() {

      // this.url = $("#analyzed_data_url").val();
      this.url = "https://storage.googleapis.com/snap2insight-livedemo/assessment/test_analysis.json";
      this.http.get(this.url).subscribe((res) => {
          this.tableData = res;

          this.tableData = this.tableData.ResultSet.row;


          console.log(this.tableData);



          this.chRef.detectChanges();


          const table: any = $('table');
          this.dataTable = table.DataTable();

          this.showTable = true;


          var self = this;
          table.on('search.dt', function() {
              var value = $('.dataTables_filter input').val();
              console.log(value); 
              
              console.log(table.DataTable().rows({
                  filter: 'applied'
              }).data());

              this.filteredData = table.DataTable().rows({
                  filter: 'applied'
              }).data().toArray();

              var self2 = this;
              var c = < HTMLCanvasElement > document.getElementById("myCanvas");
              var ctx = c.getContext("2d");

              ctx.clearRect(0, 0, 700, 700);

              var img = new Image();

              img.src = self.src;
              img.onload = function() {

                  ctx.drawImage(img, 0, 0, 500, 500);

                  for (var u in self2.filteredData) {

                      for (var t in self.tableData) {




                          if (self.tableData[t].upc == self2.filteredData[u][0]) {
                              ctx.beginPath();
                              ctx.rect(((self.tableData[t].x) / 6), ((self.tableData[t].y) / 8.2), (self.tableData[t].width / 6.2), (self.tableData[t].height / 6.4));
                            //   ctx.rect(((self.tableData[t].x) / 5), ((self.tableData[t].y) / 6), (self.tableData[t].width / 5), (self.tableData[t].height / 5));
                              ctx.fillStyle = 'transparent';
                              ctx.fill();
                              ctx.lineWidth = 7;
                              ctx.strokeStyle = 'blue';
                              ctx.stroke();

                          }
                      }
                  }

              }

          });

          
          for(var i in this.tableData){

            this.chartData[this.tableData[i].brandName] = 1 + (this.chartData[this.tableData[i].brandName] || 0);
            // if(this.tableData[i].brandName==undefined){
            //   this.chartData[this.tableData[i].brandName]=1;
            // }
            // else{
            //   this.chartData[this.tableData[i].brandName] = this.chartData[this.tableData[i].brandName] + 1;
            // }
          }


          console.log(this.chartData);

          var temp_self = this;
          var arr = Object.keys( this.chartData ).map(function ( key ) { return temp_self.chartData[key]; });
          console.log(arr);
          

          let tempSort = [],sortedObject = {};
tempSort = Object.keys(this.chartData).sort((a, b) => {
                        return this.chartData[b] - this.chartData[a] 
                    })
                    // .reduce((prev, curr, i) => {
                    //     prev[i] = this.chartData[curr]
                    //     return prev;
                    // });

                    //console.log(tempSort);
                    let cnt=0;
                    for(var y=0;y<5;y++){
                        //while(cnt<5){
                        for(var j in this.chartData){
                            if(tempSort[y]==j){
                                sortedObject[j]=this.chartData[j];
                                //tempSort.splice(y,1);
                            }
                        }
                    //}
                    }

                    this.distinctBrands = JSON.parse(JSON.stringify(tempSort));
                    console.log(this.distinctBrands);
                    this.selectedBrand="";

                    tempSort.splice(0,5);
                    // for(var y=0;y<5;y++){
                    
                    // }




                    console.log(tempSort);
                    let sum_others = 0;
                    for(var y=0;y<tempSort.length;y++){

                        for(var u in this.chartData){
                            if(tempSort[y]==u){
                                sum_others = sum_others+this.chartData[u];
                                //sortedObject[j]=this.chartData[j];
                                //tempSort.splice(y,1);
                            }
                        }

                    }

                    sortedObject["Others"] = sum_others;
                    //for(var z in this.chartData){
                        // for(var x in sortedObject){
                        //     if()
                        // }
                        // sum = sum + this.chartData[z];
                    //}
//                    sortedObject["Others"] = sum;

                    console.log(sortedObject);

//           let entries = Object.entries(this.chartData);
// // [["you",100],["me",75],["foo",116],["bar",15]]

// let sorted : any = entries.sort(function(a, b) {a[1] - b[1]});
// [["bar",15],["me",75],["you",100],["foo",116]]

          // //var temp = {};
          // this.tempChartData = {};
          // var max5_cnt =0;
          // for(var a in arr){
          //   while(max5_cnt<5){
          //     this.tempChartData[a] = arr[a];
          //   }
          // }
          // var temp_cnt =0;
          // for(var b=5;b<arr.length;b++){
          //   temp_cnt = temp_cnt + arr[b];
          // }
          // this.tempChartData["Others"] = temp_cnt;

//           var counts = {};
// for (var i = 0; i < arr.length; i++) {
//     counts[arr[i]] = 1 + (counts[arr[i]] || 0);
// }

          // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

      var self4 = this;
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Brands');
        data.addColumn('number', 'Count');
        // data.addRows([
        //   ['Mushrooms', 3],
        //   ['Onions', 1],
        //   ['Olives', 1],
        //   ['Zucchini', 1],
        //   ['Pepperoni', 2]
        // ]);

        for(var j in sortedObject){
          //console.log(j);
          //console.log(self4.chartData[j]);
          data.addRow([j,sortedObject[j]]);
        }

        // Set chart options
        var options = {'title':'Brand Share',
                       'width':600,
                       'height':500,
                        'pieHole':0.4};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }


      
   

      })

  }



  mouseEnter(e) {
      //console.log(e);
  }


  mouseLeave(e) {
      // console.log(e);
  }


  productClick(td) {
      var c = < HTMLCanvasElement > document.getElementById("myCanvas");
      var ctx = c.getContext("2d");

      //for(var t in this.tableData){
      ctx.clearRect(0, 0, 700, 700);
      //ctx.beginPath();
      //}

      var img = new Image();

      img.src = this.src;
      var self = this;
      img.onload = function() {

          ctx.drawImage(img, 0, 0, 500, 500);

          for (var t in self.tableData) {

              if (self.tableData[t].upc == td.upc) {
                  ctx.beginPath();
                  ctx.rect(((self.tableData[t].x) / 6), ((self.tableData[t].y) / 8.2), (self.tableData[t].width / 6.2), (self.tableData[t].height / 6.4));
                //   ctx.rect(((self.tableData[t].x) / 5), ((self.tableData[t].y) / 6), (self.tableData[t].width / 5), (self.tableData[t].height / 5));
                  ctx.fillStyle = 'transparent';
                  ctx.fill();
                  ctx.lineWidth = 7;
                  ctx.strokeStyle = 'yellow';
                  ctx.stroke();
                  //ctx.clearRect();
              }
              if (self.tableData[t].upc != td.upc) {
                  ctx.beginPath();
                  ctx.rect(((self.tableData[t].x) / 6), ((self.tableData[t].y) / 8.2), (self.tableData[t].width / 6.2), (self.tableData[t].height / 6.4));
                  ctx.fillStyle = 'transparent';
                  ctx.fill();
                  ctx.lineWidth = 7;
                  ctx.strokeStyle = 'blue';
                  ctx.stroke();
              }

          }

      }

  }

  changeBrand(sb){
      //console.log(sb);
      //console.log(this.tableData);
      this.brandSelected = true;
      var total_cnt=0,bottom_cnt=0, middle_cnt=0,top_cnt=0,bottom_percent=0,middle_percent=0,top_percent=0;
      for (var td in this.tableData){
        if(this.tableData[td].brandName==sb){
            if(this.tableData[td].shelfLevel=="Bottom"){
                bottom_cnt = bottom_cnt + 1; 
            }
            if(this.tableData[td].shelfLevel=="Middle"){
                middle_cnt = middle_cnt  + 1; 
            }
            if(this.tableData[td].shelfLevel=="Top"){
                top_cnt = top_cnt + 1; 
            }
        }
      }

      total_cnt = bottom_cnt + middle_cnt + top_cnt;

      bottom_percent = (bottom_cnt/total_cnt)*100;
      middle_percent = (middle_cnt/total_cnt)*100;
      top_percent = (top_cnt/total_cnt)*100;


      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart2);

      function drawChart2() {
        // Define the chart to be drawn.
        var data = google.visualization.arrayToDataTable([
           ['ShelfLevel', 'Percentile'],
           ['TOP',  top_percent],
           ['MIDDLE',  middle_percent],
           ['BOTTOM', bottom_percent ]
        ]);

        var options = {title: 'Brandwise Shelf Analysis','width':600,
        'height':500}; 

        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div_bar'));
        chart.draw(data, options);
     }
  }



}