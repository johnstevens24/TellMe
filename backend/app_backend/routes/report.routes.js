const express = require('express');
const router = express.Router();

module.exports = app => {
    const reports = require("../controllers/report.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", reports.createReport);   
  
    // Retrieve all reports
    router.get("/", reports.findAllReports);
    router.get("/vidId/:video_id", reports.findReportsByVideoId)
    router.get("/reason/:reason", reports.findReportsByReasoning)
    router.get("/optionId/:option_id", reports.findReportsByOptionId)
    router.get("/userId/:user_id", reports.findReportsByUserId)
    router.get("/vidThreshold/:video_id", reports.getOptionsWithReportCountGreaterThan)
    router.get("/optionsReported/:user_id/:video_id", reports.getOptionsReportedByUserForVideo)
    router.get("/hasMaxReports/:video_id", reports.hasReportsCountGreaterThan)
    router.get("/hasReportedVideo/:user_id/:video_id", reports.hasReportedVideo)
    router.get("/topReasonForOption/:option_id", reports.findMostReportedReasonByOptionId)
  
    app.use('/reports', router);  // first part of the url
  };