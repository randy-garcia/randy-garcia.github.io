DBUtility dbutil = new DBUtility();
String sql;

// 1. create emergency contact
int contact_id = 0;
String report_type = request.getParameter("report_type");
String report_name = request.getParameter("report_name");
String report_notes = request.getParameter("report_notes");
String report_object = request.getParameter("report_object"); //maybe cast error here?
System.out.println("A report is submitted!");
if (report_type != null) {report_type = "'" + report_type + "'";}
if (report_name != null) {report_name = "'" + report_name + "'";}
if (report_notes != null) {report_notes = "'" + report_notes + "'";}
if (report_object != null) {report_object = "'" + report_object + "'";}
if (report_type != null && report_name != null) {
    // create the contact
    sql = "insert into placepoint (type, name, notes, object) " +
            "values (" + report_type + "," + report_name + "," + report_notes + ","
            + report_object + ")";
    dbutil.modifyDB(sql);
}