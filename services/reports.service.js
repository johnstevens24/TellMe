import http from "../http-common";

//this file gives the screens some functions to use to call data from the server

class ReportDataService {
    create(data) {
      return http.post("/reports", data);
    }
  
    findAll() {
      return http.get("/reports");
    }
  
    findReportsByVideoId(videoId) {
      return http.get(`/reports/vidId/${videoId}`);
    }
  
    findReportsByReasoning(reason) {
      return http.get(`/reports/reason/${reason}`);
    }
  
    findReportsByOptionId(optionId) {
      return http.get(`/reports/optionId/${optionId}`);
    }
  
    findReportsByUserId(userId) {
      return http.get(`/reports/userId/${userId}`);
    }
  
    getOptionsWithReportCountGreaterThan(videoId) {
      return http.get(`/reports/vidThreshold/${videoId}`);
    }
  
    getOptionsReportedByUserForVideo(userId, videoId) {
      return http.get(`/reports/optionsReported/${userId}/${videoId}`);
    }
  
    hasReportsCountGreaterThan(videoId) {
      return http.get(`/reports/hasMaxReports/${videoId}`);
    }

    hasReportedVideo(userId, videoId) {
      return http.get(`/reports/hasReportedVideo/${userId}/${videoId}`);
    }

    findMostReportedReasonByOptionId(optionId) {
      return http.get(`/reports/topReasonForOption/${optionId}`);
    }

  }
  
  export default new ReportDataService();