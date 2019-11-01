'use strict';

require('dotenv').config();
const videoIntelligence = require('@google-cloud/video-intelligence');
const client = new videoIntelligence.VideoIntelligenceServiceClient({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});
(async () => {
  
  
  const gcsUri = 'gs://comp_storage/Comp_video/main.mp4';
  const request = {
    inputUri: gcsUri,
    features: ['LABEL_DETECTION'],
  };
  const [operation] = await client.annotateVideo(request);
  console.log(
    'Waiting for operation to complete... (this may take a few minutes)'
  );
  const [operationResult] = await operation.promise();
  const annotations = operationResult.annotationResults[0];
  const labels = annotations.segmentLabelAnnotations;
  labels.forEach(label => {
    console.log(`Label ${label.entity.description} occurs at:`);
    label.segments.forEach(segment => {
      segment = segment.segment;
      if (segment.startTimeOffset.seconds === undefined) {
        segment.startTimeOffset.seconds = 0;
      }
      if (segment.startTimeOffset.nanos === undefined) {
        segment.startTimeOffset.nanos = 0;
      }
      if (segment.endTimeOffset.seconds === undefined) {
        segment.endTimeOffset.seconds = 0;
      }
      if (segment.endTimeOffset.nanos === undefined) {
        segment.endTimeOffset.nanos = 0;
      }
      console.log(
        `Start: ${segment.startTimeOffset.seconds} +
          .${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}`
      );
      console.log(
        `End: ${segment.endTimeOffset.seconds}. +
          ${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}`
      );
    });
  });
})();