// will pass line coordiantes in URL
$(document).ready(function() {
       
    $("button[name='drawroute']").click(function() {
        var domElement = $(`   <div id="menu">
        <br>
          <form id = "create_report_form">
              <div><label>Trail Name:&nbsp</label><input placeholder="" name="report_name"></div><br>
          <div>
              <label>Difficulty:&nbsp&nbsp&nbsp</label>
            <select name="report_type">
              <option name="report_type" value="class1">Class 1</option>
              <option name="report_type" value="class2">Class 2</option>
              <option name="report_type" value="class3">Class 3</option>
              <option name="report_type" value="class4">Class 4</option>
              <option name="report_type" value="class5">Class 5</option>
              <option name="report_type" value="unk">unknown</option>
            </select>

          </div><br>
          <div><label>Notes:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label><input placeholder="" name="report_notes"></div><br>
          <div><label>Coordiantes:&nbsp</label><input placeholder="" name="report_lat" value="` + "cpcoordstr" + `readonly></div>
          <button type="submit" class="esri-button" id="report_submit_btn">
            <span ></span> Submit
          </button>
        </form>
      </div>`);
        $(this).after(domElement);

        
    });
    
});